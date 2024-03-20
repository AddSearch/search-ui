import './autocomplete.scss';
import handlebars from 'handlebars';
import { AUTOCOMPLETE_TYPE } from './index';
import {
  setHideAutomatically,
  autocompleteSuggestions,
  autocompleteSearch,
  setActiveSuggestion,
  autocompleteCustomFields, autocompleteHideAndDropRendering
} from '../../actions/autocomplete';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { addClickTrackers, sendAutocompleteStats } from '../../util/analytics';
import { redirectToSearchResultsPage } from '../../util/history';
import { defaultCategorySelectionFunction } from '../../util/handlebars';
import PRECOMPILED_AUTOCOMPLETE_TEMPLATE from './precompile-templates/autocomplete.handlebars';
import { registerHelper } from '../../util/handlebars';


export default class Autocomplete {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.lastOnmouseOver = null;

    if (this.conf.hideAutomatically === false) {
      this.reduxStore.dispatch(setHideAutomatically(false));
    }

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    registerHelper('selectSearchResultCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'autocomplete', (state) => this.autocompleteResultsChanged(state));
      observeStoreByKey(this.reduxStore, 'keyword', (state) => this.keywordChanged(state));
    }

    if (conf.infiniteScrollElement) {
      this.conf.infiniteScrollElement.addEventListener('scroll', () => this.onScroll());
    }

    if (conf.sources && conf.sources.length) {
      conf.sources.forEach(s => {
        if (s.client) {
          s.client.setCollectAnalytics(false);
        }
      });
    }
  }


  autocompleteResultsChanged(state) {
    // Wait until pending API requests have finished (if multiple autocomplete clients)
    if (state.pendingRequests.length !== 0) {
      return;
    }

    // Send possible search analytics
    if (state.keyword && state.keyword !== '') {
      this.sendSearchAnalytics(state);
    }

    // Render
    this.render(state);
  }


  sendSearchAnalytics(state) {
    let statArr = [];
    this.conf.sources.forEach(v => {
      // Analytics supported for autocomplete type = search
      if (v.type === AUTOCOMPLETE_TYPE.SEARCH && v.collectSearchAnalytics) {
        const client = v.client || this.client;
        const hits = state.searchResultsStats[v.jsonKey] ? state.searchResultsStats[v.jsonKey].total_hits : 0;
        statArr.push({client: client, numberOfResults: hits});
      }
    });

    sendAutocompleteStats(state.keyword, statArr);
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed, not externally set (e.g. by browser's back button)
    const keyword = kw.skipAutocomplete === false ? kw.value : null;

    if (keyword === '') {
      this.reduxStore.dispatch(autocompleteHideAndDropRendering());
    }

    this.conf.sources.forEach(v => {
      const client = v.client || this.client;
      if (v.type === AUTOCOMPLETE_TYPE.SUGGESTIONS) {
        this.reduxStore.dispatch(autocompleteSuggestions(client, keyword));
      }
      else if (v.type === AUTOCOMPLETE_TYPE.CUSTOM_FIELDS) {
        this.reduxStore.dispatch(autocompleteCustomFields(client, keyword, v.field));
      }
      else if (v.type === AUTOCOMPLETE_TYPE.SEARCH) {
        const currentPaging = client.getSettings().paging;
        client.setPaging(1, currentPaging.pageSize, currentPaging.sortBy, currentPaging.sortOrder);
        this.reduxStore.dispatch(autocompleteSearch(client, v.jsonKey, keyword));
      }
    });
  }


  loadMore(keyword) {
    this.conf.sources.forEach(v => {
      const client = v.client;
      if (client && v.type === AUTOCOMPLETE_TYPE.SEARCH) {
        client.nextPage();
        this.reduxStore.dispatch(autocompleteSearch(client, v.jsonKey, keyword, true));
      }
    });
  }


  render(autocompleteState) {

    // Hide autocomplete after a search is triggered
    if (autocompleteState.dropRendering && this.renderedHtml) {
      document.getElementById(this.conf.containerId).innerHTML = '';
      this.renderedHtml = '';
      return;
    }

    // Don't re-render while API requests are pending
    if (autocompleteState.pendingRequests.length !== 0 || autocompleteState.dropRendering) {
      return;
    }

    // Hide autocomplete
    if (autocompleteState.visible === false) {
      document.getElementById(this.conf.containerId).innerHTML = '';
      this.renderedHtml = '';
      return;
    }

    // Autocomplete data (search suggestions, search results, or both)
    const { suggestions, customFields, searchResults, activeSuggestionIndex } = autocompleteState;
    const data = {
      activeSuggestionIndex,
      suggestions,
      customFields,
      searchResults
    };


    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else if (this.conf.template) {
      html = handlebars.compile(this.conf.template)(data);
    } else {
      html = PRECOMPILED_AUTOCOMPLETE_TEMPLATE(data);
    }
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    if (this.conf.renderCompleteCallback && typeof this.conf.renderCompleteCallback === 'function') {
      this.conf.renderCompleteCallback();
    }


    // Attach events to suggestions only for keyboard accessibility
    const lis = container.querySelector('.suggestions') ? container.querySelectorAll('.suggestions > li') : [];
    const suggestionsContainers = container.querySelectorAll('.suggestions');
    for (let i=0; i<lis.length; i++) {
      lis[i].onmousedown = (e) => this.suggestionMouseDown(e);
      if (suggestionsContainers.length <= 1) {
        lis[i].onmouseenter = (e) => this.suggestionMouseEnter(e);
      }
    }

    // Send result clicks to analytics from the first child of searchResults
    if (searchResults[Object.keys(searchResults)[0]]) {
      const links = container.querySelectorAll('[data-analytics-click]');

      let analyticsClient = null;
      this.conf.sources.forEach(v => {
        if (v.type === AUTOCOMPLETE_TYPE.SEARCH) {
          if (!analyticsClient) {
            analyticsClient = v.client;
          }
        }
      });

      // Use default client
      if (!analyticsClient) {
        analyticsClient = this.client;
      }

      addClickTrackers(analyticsClient, links, {hits: searchResults[Object.keys(searchResults)[0]]});
    }

    // If infinite scroll and the first request, scroll top
    if (this.conf.infiniteScrollElement &&
        !autocompleteState.appendResults) {
      this.conf.infiniteScrollElement.scrollTop = 0;
    }

    // Callback function for alignment
    if (this.conf.onShow) {
      this.conf.onShow(container);
    }
  }


  suggestionMouseDown(e) {
    const keyword = e.target.getAttribute('data-keyword');
    const store = this.reduxStore;
    store.dispatch(setKeyword(keyword, true, null, true));

    // Redirect to search results page
    const searchResultsPageUrl = store.getState().search.searchResultsPageUrl;
    if (searchResultsPageUrl) {
      redirectToSearchResultsPage(searchResultsPageUrl, keyword);
    }
    // Search on this page
    else {
      store.dispatch(search(this.client, keyword, null, null, null, store));
    }
  }


  suggestionMouseEnter(e) {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    // Fire once
    if (index !== null && index !== this.lastOnmouseOver) {
      this.lastOnmouseOver = index;
      this.reduxStore.dispatch(setActiveSuggestion(index, false));
    }
  }


  onScroll() {
    const autocompleteState = this.reduxStore.getState().autocomplete;
    if (autocompleteState.pendingRequests.length === 0) {
      const scrollable = this.conf.infiniteScrollElement;

      if (scrollable.scrollHeight > 0 &&
          Math.ceil(scrollable.offsetHeight + scrollable.scrollTop) >= scrollable.scrollHeight) {
        const keyword = this.reduxStore.getState().keyword.value;
        this.loadMore(keyword);
      }
    }

  }
}
