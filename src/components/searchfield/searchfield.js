/* global window */
import './searchfield.scss';
import { SEARCHFIELD_TEMPLATE } from './templates';
import handlebars from 'handlebars';
import {
  autocompleteHide,
  autocompleteShow,
  keyboardEvent,
  setActiveSuggestion,
  ARROW_DOWN,
  ARROW_UP,
  autocompleteHideAndDropRendering
} from '../../actions/autocomplete';
import { setPage } from '../../actions/pagination';
import { setKeyword } from '../../actions/keyword';
import { observeStoreByKey } from '../../store';
import { MATCH_ALL_QUERY, WARMUP_QUERY_PREFIX } from '../../index';
import { redirectToSearchResultsPage } from '../../util/history';
import { validateContainer } from '../../util/dom';

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
    this.firstRenderDone = false;
    this.onSearch = onSearch;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'keyword', (kw) => {
        if (kw.searchFieldContainerId === this.conf.containerId || kw.searchFieldContainerId === null) {
          this.render(kw.value);
        }
      });
      observeStoreByKey(this.reduxStore, 'autocomplete', (ac) => this.onAutocompleteUpdate(ac));
    }
  }


  onAutocompleteUpdate(state) {
    if ((state.suggestions.length > 0 || state.customFields.length > 0) && state.setSuggestionToSearchField) {
      // Set field value
      if (state.activeSuggestionIndex !== null && state.setSuggestionToSearchField) {
        const suggestionObj = state.suggestions[state.activeSuggestionIndex] || state.customFields[state.activeSuggestionIndex];
        const suggestion = suggestionObj.value;
        this.render(suggestion);
      }
      // Revert to original typed keyword
      else if (state.activeSuggestionIndex === null) {
        this.render(this.reduxStore.getState().keyword.value);
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
    this.onSearch(kw, false, searchAsYouType, this.conf.fieldForInstantRedirect);
  }


  redirectOrSearch(keyword) {
    const searchResultsPageUrl = this.reduxStore.getState().search.searchResultsPageUrl;

    // Redirect to results page
    if (searchResultsPageUrl &&
        this.conf.ignoreSearchResultsPageUrl !== true &&
        keyword && keyword.length > 0) {
      redirectToSearchResultsPage(searchResultsPageUrl, keyword);
    }

    // Search
    else {
      this.executeSearch(this.client, keyword, false);
    }
  }


  render(preDefinedKeyword) {
    const container = document.getElementById(this.conf.containerId);

    // Field already exists. Don't re-render
    if (container.querySelector('input')) {
      if (preDefinedKeyword !== null &&
          preDefinedKeyword !== MATCH_ALL_QUERY &&
          container.querySelector('input').value !== preDefinedKeyword) {
        container.querySelector('input').value = preDefinedKeyword;
      }
      return;
    }

    // New field. Render
    container.innerHTML = handlebars.compile(this.conf.template || SEARCHFIELD_TEMPLATE)(this.conf);
    this.field = container.querySelector('input');

    // Set value. Don't pass with data to handlebars to get the keyboard caret position right on all browsers
    if (preDefinedKeyword !== MATCH_ALL_QUERY) {
      this.field.value = preDefinedKeyword;
    }

    // Event listeners to the field
    this.field.oninput = (e) => this.oninput(e);
    this.field.onkeypress = (e) => this.onkeypress(e);
    this.field.onkeyup = (e) => this.onkeyup(e);
    this.field.onfocus = (e) => this.onfocus(e);
    this.field.onblur = (e) => setTimeout(() => this.onblur(), 200); // Possible search button onclick event first

    // Event listeners to the possible search button
    if (container.querySelector('button')) {
      container.querySelector('button').onclick = () => {
        let keyword = this.field.value;
        if (keyword === '' && this.matchAllQuery) {
          keyword = MATCH_ALL_QUERY;
        }
        this.reduxStore.dispatch(setKeyword(keyword, true));
        this.reduxStore.dispatch(autocompleteHide());
        this.redirectOrSearch(keyword);
      }
    }

    // Event listeners to the form
    if (container.querySelector('form')) {
      container.querySelector('form').onsubmit = (e) => e.preventDefault();
    }


    // Autofocus when loaded first time
    if (this.conf.autofocus !== false &&
      this.firstRenderDone === false) {
      this.field.focus();
      this.firstRenderDone = true;
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
    if (this.conf.searchAsYouType === true) {
      this.executeSearch(this.client, keyword, true);
    }
  }

  // Handle keyboard navi
  onkeyup(e) {
    const store = this.reduxStore;
    if (e.keyCode === KEYCODES.ARROW_DOWN) {
      store.dispatch(keyboardEvent(ARROW_DOWN));
    }
    else if (e.keyCode === KEYCODES.ARROW_UP) {
      store.dispatch(keyboardEvent(ARROW_UP));
    }
  }

  // Handle enter
  onkeypress(e) {
    if (e.keyCode === KEYCODES.ENTER) {
      const store = this.reduxStore;
      const keyword = e.target.value;
      store.dispatch(setKeyword(keyword, true));
      store.dispatch(autocompleteHide());
      this.redirectOrSearch(keyword);
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
      this.reduxStore.dispatch(autocompleteHide());
    }
  }
}
