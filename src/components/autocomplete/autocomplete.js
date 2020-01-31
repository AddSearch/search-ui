import './autocomplete.scss';
import { AUTOCOMPLETE_TEMPLATE } from './templates';
import handlebars from 'handlebars';
import { AUTOCOMPLETE_TYPE } from './index';
import { setHideAutomatically, autocompleteSuggestions, autocompleteSearch, setActiveSuggestion } from '../../actions/autocomplete';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';
import { addClickTrackers } from '../../util/analytics';
import { redirectToSearchResultsPage } from '../../util/history';
import { defaultCategorySelectionFunction } from '../../util/handlebars';


export default class Autocomplete {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
    this.lastOnmouseOver = null;

    if (this.conf.hideAutomatically === false) {
      getStore().dispatch(setHideAutomatically(false));
    }

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    handlebars.registerHelper('selectSearchResultCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'autocomplete', (state) => this.render(state));
      observeStoreByKey(getStore(), 'keyword', (state) => this.keywordChanged(state));
    }
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed, not externally set (e.g. by browser's back button)
    const keyword = kw.skipAutocomplete === false ? kw.value : null;

    this.conf.sources.forEach(v => {
      const client = v.client || this.client;
      if (v.type === AUTOCOMPLETE_TYPE.SUGGESTIONS) {
        getStore().dispatch(autocompleteSuggestions(client, keyword));
      }
      else if (v.type === AUTOCOMPLETE_TYPE.SEARCH) {
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

    const container = renderToContainer(this.conf.containerId, this.conf.template || AUTOCOMPLETE_TEMPLATE, data);

    // Attach events to suggestions only for keyboard accessibility
    const lis = container.querySelector('.suggestions') ? container.querySelectorAll('.suggestions > li') : [];
    for (let i=0; i<lis.length; i++) {
      lis[i].onmousedown = (e) => this.suggestionMouseDown(e);
      lis[i].onmouseenter = (e) => this.suggestionMouseEnter(e);
    }

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data);
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