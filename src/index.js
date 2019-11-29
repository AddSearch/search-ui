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
import SortBy from './components/sortby';
import { initRedux, getStore } from './store';
import { regisiterHelpers } from './util/handlebars';
import { initFromURL } from './util/history';
import { autocompleteHide } from './actions/autocomplete';
import { start, search, setSearchResultsPageUrl } from './actions/search';
import { setKeyword } from './actions/keyword';
import { sortBy } from './actions/sortby';

export const WARMUP_QUERY_PREFIX = '_addsearch_';
export const MATCH_ALL_QUERY = '*';

// Static
oa.polyfill();
regisiterHelpers();

export default class SearchUI {

  constructor(client, settings) {
    this.client = client;
    this.settings = settings || {};
    initRedux(this.settings);
  }


  start() {
    this.initFromClientSettings();

    getStore().dispatch(setSearchResultsPageUrl(this.settings.searchResultsPageUrl));

    // Possible custom function to create filter group with custom and/or logic
    const createFilterObjectFunction = this.settings && this.settings.createFilterObjectFunction ?
      this.settings.createFilterObjectFunction : createFilterObject;
    initFromURL(this.client, createFilterObjectFunction);

    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }

    // FilterStateObserver to update client's filter object when any of the filters change
    new FilterStateObserver(this.client, createFilterObjectFunction, this.settings.matchAllQuery);

    getStore().dispatch(start());
  }


  getReduxStore() {
    return getStore();
  }


  /*
   * Utils
   */

  initFromClientSettings() {
    const paging = this.client.getSettings().paging;
    getStore().dispatch(sortBy(this.client, paging.sortBy, paging.sortOrder));
  }

  matchAllQuery() {
    const store = getStore();
    if (store.getState().keyword.value === '') {
      store.dispatch(setKeyword(MATCH_ALL_QUERY, false));
      store.dispatch(search(this.client, MATCH_ALL_QUERY));
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
    new SearchField(this.client, conf, this.settings.matchAllQuery === true);
  }

  autocomplete(conf) {
    new Autocomplete(this.client, conf);
  }

  searchResults(conf) {
    new SearchResults(conf);
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
    getStore().dispatch(search(this.client, keyword));
  }

  hideAutocomplete() {
    getStore().dispatch(autocompleteHide());
  }
}