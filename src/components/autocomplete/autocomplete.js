import './autocomplete.scss';
import handlebars from 'handlebars';
import { setHideAutomatically, autocompleteSuggestions, autocompleteSearch, setActiveSuggestion } from '../../actions/autocomplete';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer } from '../../util/dom';
import { redirectToSearchResultsPage } from '../../util/history';
import { defaultCategorySelectionFunction } from '../../util/handlebars';


const TEMPLATE = `
  <div class="addsearch-autocomplete">
    {{#gt suggestions.length 0}}
      <ul class="suggestions">
        {{#each ../suggestions}}
          <li data-keyword="{{value}}" data-index="{{@index}}" {{#equals ../../activeSuggestionIndex @index}}class="active"{{/equals}}>
            {{value}}
          </li>
        {{/each}}
      </ul>
    {{/gt}}
  </div>
`;


export default class Autocomplete {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
    this.lastOnmouseOver = null;

    if (this.conf.hideAutomatically === false) {
      getStore().dispatch(setHideAutomatically(false));
    }

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    handlebars.registerHelper('selectSearchResultCategory', (categories) => categorySelectionFunction(categories));

    observeStoreByKey(getStore(), 'autocomplete', (state) => this.render(state));
    observeStoreByKey(getStore(), 'keyword', (state) => this.keywordChanged(state));
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed, not externally set (e.g. by browser's back button)
    const keyword = kw.externallySet === false ? kw.value : null;

    this.conf.sources.forEach(v => {
      const client = v.client || this.client;
      if (v.type === 'suggestions') {
        getStore().dispatch(autocompleteSuggestions(client, keyword));
      }
      else if (v.type === 'search') {
        getStore().dispatch(autocompleteSearch(client, v.jsonKey, keyword));
      }
    });
  }


  render(autocompleteState) {
    // Don't re-render while API requests are pending
    if (autocompleteState.pendingRequests !== 0) {
      return;
    }

    // Hide autocomplete
    if (autocompleteState.hide === true) {
      document.getElementById(this.conf.containerId).innerHTML = '';
      return;
    }

    // Autocomplete data (search suggestions, search results, or both)
    const { suggestions, searchResults, activeSuggestionIndex } = autocompleteState;
    const data = {
      activeSuggestionIndex,
      suggestions,
      searchResults
    };

    const container = renderToContainer(this.conf.containerId, this.conf.template || TEMPLATE, data);

    // Attach events to suggestions only for keyboard accessibility
    const lis = container.querySelector('.suggestions') ? container.querySelectorAll('.suggestions > li') : [];
    for (let i=0; i<lis.length; i++) {
      lis[i].onmousedown = (e) => this.suggestionMouseDown(e);
      lis[i].onmouseenter = (e) => this.suggestionMouseEnter(e);
    }
  }


  suggestionMouseDown(e) {
    const keyword = e.target.getAttribute('data-keyword');
    const store = getStore();
    store.dispatch(setKeyword(keyword, true));

    // Redirect to search results page
    const searchResultsPageUrl = store.getState().search.searchResultsPageUrl;
    if (searchResultsPageUrl) {
      redirectToSearchResultsPage(searchResultsPageUrl, keyword);
    }
    // Search on this page
    else {
      store.dispatch(search(this.client, keyword));
    }
  }


  suggestionMouseEnter(e) {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    // Fire once
    if (index !== null && index !== this.lastOnmouseOver) {
      this.lastOnmouseOver = index;
      getStore().dispatch(setActiveSuggestion(index, false));
    }
  }
}