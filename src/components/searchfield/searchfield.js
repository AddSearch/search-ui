/* global window */
import './searchfield.scss';
import handlebars from 'handlebars';
import { search } from '../../actions/search';
import { autocompleteHide, keyboardEvent, setActiveSuggestion, ARROW_DOWN, ARROW_UP } from '../../actions/autocomplete';
import { setPage } from '../../actions/pagination';
import { setKeyword } from '../../actions/keyword';
import { getStore, observeStoreByKey } from '../../store';
import { MATCH_ALL_QUERY, WARMUP_QUERY_PREFIX } from '../../index';
import { redirectToSearchResultsPage } from '../../util/history';

/**
 * HTML template
 */
const TEMPLATE = `
  <form class="addsearch-searchfield" autocomplete="off" action="?" role="search">
    <input type="search" placeholder="{{placeholder}}" aria-label="Search field" />
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;

const KEYCODES = {
  ARROW_DOWN: 40,
  ARROW_UP: 38,
  ENTER: 13,
  BACKSPACE: 8,
  DELETE: 46
};

export default class SearchField {

  constructor(client, conf, matchAllQueryWhenSearchFieldEmpty) {
    this.client = client;
    this.conf = conf;
    this.matchAllQuery = matchAllQueryWhenSearchFieldEmpty;
    this.firstRenderDone = false;

    observeStoreByKey(getStore(), 'keyword', (kw) => this.render(kw.value));
    observeStoreByKey(getStore(), 'autocomplete', (ac) => this.onAutocompleteUpdate(ac));
  }


  onAutocompleteUpdate(acState) {
    if (acState.suggestions.length > 0 && acState.setSuggestionToSearchField) {
      // Set field value
      if (acState.activeSuggestionIndex !== null && acState.setSuggestionToSearchField) {
        const suggestion = acState.suggestions[acState.activeSuggestionIndex].value;
        this.render(suggestion);
      }
      // Revert to original typed keyword
      else if (acState.activeSuggestionIndex === null) {
        this.render(getStore().getState().keyword.value);
      }
    }
  }


  search(client, keyword) {
    let kw = keyword;
    if (kw === '' && this.matchAllQuery) {
      kw = MATCH_ALL_QUERY;
    }

    const store = getStore();
    if (kw.indexOf(WARMUP_QUERY_PREFIX) !== 0) {
      store.dispatch(setPage(client, 1));
    }
    store.dispatch(search(client, kw));
  }


  render(preDefinedKeyword) {
    const store = getStore();
    const container = document.getElementById(this.conf.containerId);

    // Field already exists. Don't re-render
    if (container.querySelector('input')) {
      if (preDefinedKeyword && container.querySelector('input').value !== preDefinedKeyword) {
        container.querySelector('input').value = preDefinedKeyword;
      }
      return;
    }

    // New field. Render
    container.innerHTML = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const field = container.querySelector('input');

    // Set value. Don't pass to template to get the keyboard caret position right
    if (preDefinedKeyword !== MATCH_ALL_QUERY) {
      field.value = preDefinedKeyword;
    }

    // Event listeners to the field
    field.onkeyup = (e) => {
      const keyword = e.target.value;



      if (e.keyCode === KEYCODES.ARROW_DOWN) {
        store.dispatch(keyboardEvent(ARROW_DOWN));
      }
      else if (e.keyCode === KEYCODES.ARROW_UP) {
        store.dispatch(keyboardEvent(ARROW_UP));
      }
      else {
        if (e.keyCode === KEYCODES.BACKSPACE || e.keyCode === KEYCODES.DELETE) {
          store.dispatch(setActiveSuggestion(null, false));
        }

        store.dispatch(setKeyword(keyword));
        if (this.conf.searchAsYouType === true) {
          this.search(this.client, keyword);
        }
      }
    };

    field.onkeypress = (e) => {
      // Enter pressed
      if (e.keyCode === KEYCODES.ENTER) {
        const keyword = e.target.value;

        // Redirect to results page
        const searchResultsPageUrl = store.getState().search.searchResultsPageUrl;
        if (searchResultsPageUrl && keyword && keyword.length > 0) {
          redirectToSearchResultsPage(searchResultsPageUrl, keyword);
        }
        // Search
        else {
          this.search(this.client, keyword);
          store.dispatch(autocompleteHide());
        }
        return false;
      }
    };

    field.onfocus = (e) => {
      // Warmup query if search-as-you-type
      if (e.target.value === '' && this.conf.searchAsYouType === true) {
        this.search(this.client, WARMUP_QUERY_PREFIX + Math.random());
      }
    };

    field.onblur = (e) => {
      store.dispatch(autocompleteHide());
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = (e) => {
        const keyword = store.getState().keyword.value;
        this.search(this.client, keyword);
      }
    }

    // Autofocus when loaded first time
    if (this.conf.autofocus !== false &&
        this.firstRenderDone === false) {
      field.focus();
      this.firstRenderDone = true;
    }
  }
}