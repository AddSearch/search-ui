import './index.scss';
import oa from 'es6-object-assign';

import ActiveFilters from './components/activefilters';
import Autocomplete from './components/autocomplete';
import Facets from './components/facets';
import Filters from './components/filters';
import FilterStateObserver, { createFilterObject } from './components/filters/filterstateobserver';
import Pagination from './components/pagination';
import SearchField from './components/searchfield';
import SearchResults from './components/searchresults';
import SegmentedResults from './components/segmentedresults';
import SortBy from './components/sortby';
import { initRedux, getStore } from './store';
import { registerDefaultHelpers, registerHelper } from './util/handlebars';
import { initFromURL } from './util/history';
import { autocompleteHide } from './actions/autocomplete';
import { start, search, setSearchResultsPageUrl, clearSearchResults } from './actions/search';
import { segmentedSearch } from './actions/segmentedsearch';
import { setKeyword } from './actions/keyword';
import { sortBy } from './actions/sortby';
import { clearSelected } from './actions/filters';

export const WARMUP_QUERY_PREFIX = '_addsearch_';
export const MATCH_ALL_QUERY = '*';

// Static
oa.polyfill();
registerDefaultHelpers();

export default class AddSearchUI {

  constructor(client, settings) {
    this.client = client;
    this.segmentedSearchClients = {};
    this.settings = settings || {};
    initRedux(this.settings);
  }


  start() {
    this.initFromClientSettings();

    getStore().dispatch(setSearchResultsPageUrl(this.settings.searchResultsPageUrl));

    // Possible custom function to create filter group with custom and/or logic
    const createFilterObjectFunction = this.settings && this.settings.createFilterObjectFunction ?
      this.settings.createFilterObjectFunction : createFilterObject;
    initFromURL(this.client, createFilterObjectFunction, (keyword, onResultsScrollTo) => this.executeSearch(keyword, onResultsScrollTo));

    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }

    // FilterStateObserver to update client's filter object when any of the filters change
    new FilterStateObserver(this.client, createFilterObjectFunction, this.settings.onFilterChange);

    getStore().dispatch(start());
  }


  getReduxStore() {
    return getStore();
  }


  executeSearch(keyword, onResultsScrollTo) {
    getStore().dispatch(search(this.client, keyword, onResultsScrollTo));

    for (let key in this.segmentedSearchClients) {
      getStore().dispatch(segmentedSearch(this.segmentedSearchClients[key], key, keyword));
    }
  }


  /*
   * Utils
   */

  initFromClientSettings() {
    const paging = this.client.getSettings().paging;
    getStore().dispatch(sortBy(this.client, paging.sortBy, paging.sortOrder));
  }

  matchAllQuery(onResultsScrollTo) {
    const store = getStore();
    if (store.getState().keyword.value === '') {
      store.dispatch(setKeyword(MATCH_ALL_QUERY, false));
      this.executeSearch(MATCH_ALL_QUERY, onResultsScrollTo);
    }
  }

  log(msg) {
    if (this.settings.debug) {
      console.log(msg);
    }
  }


  /*
   * Components
   */

  searchField(conf) {
    new SearchField(this.client, conf, this.settings.matchAllQuery === true, (keyword, onResultsScrollTo) => this.executeSearch(keyword, onResultsScrollTo));
  }

  autocomplete(conf) {
    new Autocomplete(this.client, conf);
  }

  searchResults(conf) {
    new SearchResults(this.client, conf);
  }

  segmentedResults(conf) {
    if (!conf.client) {
      console.log('WARNING: segmentedResults configuration must include a client instance');
      return;
    }
    this.segmentedSearchClients[conf.containerId] = conf.client;
    new SegmentedResults(conf.client, conf);
  }

  facets(conf) {
    new Facets(this.client, conf);
  }

  filters(conf) {
    new Filters(this.client, conf);
  }

  sortBy(conf) {
    new SortBy(this.client, conf);
  }

  pagination(conf) {
    new Pagination(this.client, conf);
  }

  activeFilters(conf) {
    new ActiveFilters(this.client, conf);
  }

  /*
   * Public functions
   */

  search(keyword) {
    getStore().dispatch(setKeyword(keyword, true));
    this.executeSearch(keyword, null);
  }

  hideAutocomplete() {
    getStore().dispatch(autocompleteHide());
  }

  clear() {
    const store = getStore();
    store.dispatch(setKeyword('', true));
    store.dispatch(clearSelected(true));

    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery('top');
    }
    else {
      store.dispatch(clearSearchResults('top'));
    }
  }

  registerHandlebarsHelper(helperName, helperFunction) {
    registerHelper(helperName, helperFunction);
  }
}