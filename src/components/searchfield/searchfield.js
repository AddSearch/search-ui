/* global window */
import './searchfield.scss';
import handlebars from 'handlebars';
import PRECOMPILED_SEARCHFIELD_TEMPLATE from './precompile-templates/searchfield.handlebars';

import {
  autocompleteShow,
  keyboardEvent,
  setActiveSuggestion,
  ARROW_DOWN,
  ARROW_UP,
  autocompleteHideAndDropRendering
} from '../../actions/autocomplete';
import { setPage } from '../../actions/pagination';
import { setKeyword, setKeywordMinLengthRequiredToFetch } from '../../actions/keyword';
import { observeStoreByKey } from '../../store';
import { MATCH_ALL_QUERY, WARMUP_QUERY_PREFIX } from '../../index';
import { redirectToSearchResultsPage } from '../../util/history';
import { validateContainer } from '../../util/dom';
import { clearSelectedRangeFacets } from '../../actions/filters';

const KEYCODES = {
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46
};

export default class SearchField {
  constructor(client, reduxStore, conf, matchAllQueryWhenSearchFieldEmpty, onSearch) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.matchAllQuery = matchAllQueryWhenSearchFieldEmpty;
    this.minLengthToShowResults = conf.minLengthToShowResults || 1;
    this.firstRenderDone = false;
    this.onSearch = onSearch;

    const minLengthToShowResults = conf.minLengthToShowResults || 0;
    this.reduxStore.dispatch(
      setKeywordMinLengthRequiredToFetch({
        minLengthRequiredToFetch: minLengthToShowResults
      })
    );

    if (conf.selectorToBind) {
      this.bindContainer();
      observeStoreByKey(this.reduxStore, 'keyword', (kw) => {
        if (kw.setSearchFieldValue) {
          this.updateValueOnAllBoundFields(kw.value);
        }
      });
      observeStoreByKey(this.reduxStore, 'autocomplete', (ac) =>
        this.onAutocompleteUpdateBoundField(ac)
      );
    } else if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'keyword', (kw) => {
        if (
          kw.searchFieldContainerId === this.conf.containerId ||
          kw.searchFieldContainerId === null
        ) {
          this.render(kw.value);
        }
      });
      observeStoreByKey(this.reduxStore, 'autocomplete', (ac) => this.onAutocompleteUpdate(ac));
    }
  }

  updateValueOnAllBoundFields(value) {
    for (var i = 0; i < this.boundFields.length; i++) {
      this.boundFields[i].value = value;
    }
  }

  onAutocompleteUpdate(state) {
    if (
      (state.suggestions.length > 0 || state.customFields.length > 0) &&
      state.setSuggestionToSearchField
    ) {
      // Set field value
      if (state.activeSuggestionIndex !== null && state.setSuggestionToSearchField) {
        const suggestionObj =
          state.suggestions[state.activeSuggestionIndex] ||
          state.customFields[state.activeSuggestionIndex];
        const suggestion = suggestionObj.value;
        this.render(suggestion);
      }
      // Revert to original typed keyword
      else if (state.activeSuggestionIndex === null) {
        this.render(this.reduxStore.getState().keyword.value);
      }
    }

    // Update ARIA attributes based on autocomplete state
    this.updateAriaAttributes(state);
  }

  updateAriaAttributes(state) {
    if (!this.field) {
      return;
    }

    // Update aria-expanded based on visibility and whether there are results
    const hasResults = state.suggestions.length > 0 || state.customFields.length > 0;
    this.field.setAttribute('aria-expanded', state.visible && hasResults ? 'true' : 'false');

    // Update aria-activedescendant based on active suggestion
    if (state.activeSuggestionIndex !== null && hasResults) {
      // Determine if the active item is a suggestion or customField
      const isCustomField =
        state.suggestions.length === 0 ||
        (state.suggestions.length > 0 &&
          state.customFields.length > 0 &&
          state.activeSuggestionIndex >= state.suggestions.length);
      const idPrefix = isCustomField ? 'addsearch-customfield' : 'addsearch-suggestion';
      this.field.setAttribute(
        'aria-activedescendant',
        `${idPrefix}-${state.activeSuggestionIndex}`
      );
    } else {
      this.field.removeAttribute('aria-activedescendant');
    }
  }

  onAutocompleteUpdateBoundField(state) {
    if (!state.setSuggestionToSearchField) {
      return;
    }
    if (state.activeSuggestionIndex !== null) {
      const suggestionObj =
        state.suggestions[state.activeSuggestionIndex] ||
        state.customFields[state.activeSuggestionIndex];
      if (!suggestionObj) return;
      const suggestion = suggestionObj.value;
      this.updateValueOnAllBoundFields(suggestion);
    } else {
      this.updateValueOnAllBoundFields(this.reduxStore.getState().keyword.value);
    }

    // Update ARIA attributes for bound fields
    this.updateAriaAttributesForBoundFields(state);
  }

  updateAriaAttributesForBoundFields(state) {
    if (!this.boundFields || this.boundFields.length === 0) {
      return;
    }

    const hasResults = state.suggestions.length > 0 || state.customFields.length > 0;

    for (const field of this.boundFields) {
      // Update aria-expanded
      field.setAttribute('aria-expanded', state.visible && hasResults ? 'true' : 'false');

      // Update aria-activedescendant
      if (state.activeSuggestionIndex !== null && hasResults) {
        // Determine if the active item is a suggestion or customField
        const isCustomField =
          state.suggestions.length === 0 ||
          (state.suggestions.length > 0 &&
            state.customFields.length > 0 &&
            state.activeSuggestionIndex >= state.suggestions.length);
        const idPrefix = isCustomField ? 'addsearch-customfield' : 'addsearch-suggestion';
        field.setAttribute('aria-activedescendant', `${idPrefix}-${state.activeSuggestionIndex}`);
      } else {
        field.removeAttribute('aria-activedescendant');
      }
    }
  }

  executeSearch(client, keyword, searchAsYouType) {
    if (!searchAsYouType) {
      this.reduxStore.dispatch(autocompleteHideAndDropRendering());
    }
    let kw = keyword;
    if (kw === '' && this.matchAllQuery) {
      kw = MATCH_ALL_QUERY;
    }

    if (kw.indexOf(WARMUP_QUERY_PREFIX) !== 0) {
      this.reduxStore.dispatch(setPage(client, 1, null, this.reduxStore));
    }

    this.reduxStore.dispatch(clearSelectedRangeFacets(false, true));

    this.onSearch(
      kw,
      false,
      searchAsYouType,
      this.conf.fieldForInstantRedirect,
      this.reduxStore.getState().configuration.fieldForInstantRedirect,
      this.conf.disableSearch
    );
  }

  redirectOrSearch(keyword) {
    const searchResultsPageUrl = this.reduxStore.getState().search.searchResultsPageUrl;
    const searchPersistence = this.reduxStore.getState().configuration.searchPersistence;

    // Redirect to results page
    if (
      searchResultsPageUrl &&
      this.conf.ignoreSearchResultsPageUrl !== true &&
      keyword &&
      keyword.length > 0
    ) {
      redirectToSearchResultsPage(searchResultsPageUrl, keyword, searchPersistence);
    }

    // Search
    else {
      this.executeSearch(this.client, keyword, false);
    }
  }

  addEventListenersToField(field) {
    field.oninput = (e) => this.oninput(e);
    field.onkeypress = (e) => this.onkeypress(e);
    field.onkeyup = (e) => this.onkeyup(e);
    field.onfocus = (e) => this.onfocus(e);
    field.onblur = (e) => setTimeout(() => this.onblur(), 200); // Possible search button onclick event first
  }

  handleAutoFocus(field) {
    if (this.conf.autofocus !== false && this.firstRenderDone === false) {
      field.focus();
      this.firstRenderDone = true;
    }
  }

  handleSubmitKeyword(keyword) {
    const store = this.reduxStore;
    if (keyword === '' && this.matchAllQuery) {
      keyword = MATCH_ALL_QUERY;
    }
    store.dispatch(autocompleteHideAndDropRendering());
    store.dispatch(setKeyword(keyword, true, null, false));
    this.redirectOrSearch(keyword);
  }

  render(preDefinedKeyword) {
    const container = document.getElementById(this.conf.containerId);

    // Field already exists. Don't re-render
    if (container.querySelector('input')) {
      if (
        preDefinedKeyword !== null &&
        preDefinedKeyword !== MATCH_ALL_QUERY &&
        container.querySelector('input').value !== preDefinedKeyword
      ) {
        container.querySelector('input').value = preDefinedKeyword;
      }
      return;
    }

    // New field. Render
    if (this.conf.precompiledTemplate) {
      container.innerHTML = this.conf.precompiledTemplate(this.conf);
    } else if (this.conf.template) {
      container.innerHTML = handlebars.compile(this.conf.template)(this.conf);
    } else {
      container.innerHTML = PRECOMPILED_SEARCHFIELD_TEMPLATE(this.conf);
    }
    this.field = container.querySelector('input');

    // Set value. Don't pass with data to handlebars to get the keyboard caret position right on all browsers
    if (preDefinedKeyword !== MATCH_ALL_QUERY) {
      this.field.value = preDefinedKeyword;
    }

    // Event listeners to the field
    this.addEventListenersToField(this.field);

    // Event listeners to the possible search button
    if (container.querySelector('button')) {
      container.querySelector('button').onclick = () => {
        let keyword = this.field.value;
        this.handleSubmitKeyword(keyword);
      };
    }

    // Event listeners to the form
    if (container.querySelector('form')) {
      container.querySelector('form').onsubmit = (e) => e.preventDefault();
    }

    // Autofocus when loaded first time
    this.handleAutoFocus(this.field);
  }

  bindContainer() {
    this.boundFields = document.querySelectorAll(this.conf.selectorToBind);
    for (var i = 0; i < this.boundFields.length; i++) {
      // Add ARIA attributes for combobox pattern
      this.boundFields[i].setAttribute('role', 'combobox');
      this.boundFields[i].setAttribute('aria-autocomplete', 'list');
      this.boundFields[i].setAttribute('aria-expanded', 'false');
      this.boundFields[i].setAttribute(
        'aria-controls',
        'addsearch-autocomplete-listbox addsearch-autocomplete-customfields-listbox'
      );

      this.addEventListenersToField(this.boundFields[i]);
      // Event listeners to the form
      if (this.boundFields[i].form) {
        this.boundFields[i].form.onsubmit = (e) => {
          e.preventDefault();
        };
      }
    }

    // Event listeners to the possible search button
    if (this.conf.buttonSelector && document.querySelector(this.conf.buttonSelector)) {
      const boundButton = document.querySelector(this.conf.buttonSelector);
      if (boundButton.type === 'submit') {
        boundButton.type = 'button';
      }
      boundButton.onclick = () => {
        let keyword = this.boundFields[0].value;
        this.handleSubmitKeyword(keyword);
      };
    }

    // Autofocus when loaded first time
    if (this.boundFields.length === 1) {
      this.handleAutoFocus(this.boundFields[0]);
    }
  }

  /**
   * Input field events
   */

  // Handle characters and backspace
  oninput(e) {
    const store = this.reduxStore;
    let keyword = e.target.value;
    if (keyword === '' && this.matchAllQuery) {
      keyword = MATCH_ALL_QUERY;
    }

    // Keyword being erased
    if (e.keyCode === KEYCODES.BACKSPACE || e.keyCode === KEYCODES.DELETE) {
      store.dispatch(setActiveSuggestion(null, false));
    }

    const skipAutocomplete = this.conf.ignoreAutocomplete === true;
    store.dispatch(setKeyword(keyword, skipAutocomplete, this.conf.containerId));
    store.dispatch(autocompleteShow());
    if (this.conf.searchAsYouType === true) {
      this.executeSearch(this.client, keyword, true);
    }
  }

  // Handle keyboard navi
  onkeyup(e) {
    const store = this.reduxStore;
    if (e.keyCode === KEYCODES.ARROW_DOWN) {
      store.dispatch(keyboardEvent(ARROW_DOWN));
    } else if (e.keyCode === KEYCODES.ARROW_UP) {
      store.dispatch(keyboardEvent(ARROW_UP));
    }
  }

  // Handle enter
  onkeypress(e) {
    if (e.keyCode === KEYCODES.ENTER) {
      const keyword = e.target.value;
      this.handleSubmitKeyword(keyword);
    }
  }

  onfocus(e) {
    if (e.target.value === '') {
      // Execute match all query for autocomplete box
      if (this.conf.onfocusAutocompleteMatchAllQuery) {
        this.reduxStore.dispatch(setKeyword(MATCH_ALL_QUERY, false));
      }

      // Warmup query unless match all query is sent
      else if (!this.warmupQueryCompleted && !this.matchAllQuery) {
        this.executeSearch(this.client, WARMUP_QUERY_PREFIX + Math.random(), false);
        this.warmupQueryCompleted = true;
      }
    }
    this.reduxStore.dispatch(autocompleteShow());
  }

  onblur() {
    if (this.reduxStore.getState().autocomplete.hideAutomatically) {
      this.reduxStore.dispatch(autocompleteHideAndDropRendering());
    }
  }
}
