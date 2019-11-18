import './index.scss';
import oa from 'es6-object-assign';

import Autocomplete from './components/autocomplete';
import FacetGroup from './components/facetgroup';
import Filters, { FILTER_TYPE } from './components/filters';
import FilterStateObserver, { createFilterObject } from './components/filters/filterstateobserver';
import Pagination from './components/pagination';
import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import SortBy from './components/sortby';
import { getStore } from './store';
import { regisiterHelpers } from './util/handlebars';
import { initFromURL } from './util/history';
import { search } from './actions/search';
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

    // Expose some constants
    this.FILTER_TYPE = FILTER_TYPE;
  }

  start() {
    this.initFromClientSettings();

    // Possible custom function to create filter group with custom and/or logic
    const createFilterObjectFunction = this.settings && this.settings.createFilterObjectFunction ?
      this.settings.createFilterObjectFunction : createFilterObject;
    initFromURL(this.client, createFilterObjectFunction);

    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }

    // FilterStateObserver to update client's filter object when any of the filters change
    new FilterStateObserver(this.client, createFilterObjectFunction);
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

  searchBar(conf) {
    const searchbar = new SearchBar(this.client, conf, this.settings.matchAllQuery === true);
    searchbar.render();
  }

  autocomplete(conf) {
    const autocomplete = new Autocomplete(this.client, conf);
    autocomplete.render();
  }

  searchResults(conf) {
    const searchresults = new SearchResults(conf);
    searchresults.render();
  }

  facetGroup(conf) {
    new FacetGroup(this.client, conf);
  }

  filters(conf) {
    new Filters(this.client, conf);
  }

  sortBy(conf) {
    const sortby = new SortBy(this.client, conf);
    sortby.render();
  }

  pagination(conf) {
    const pagination = new Pagination(this.client, conf);
    pagination.render();
  }


  /*
   * Public functions
   */
  search(keyword) {
    getStore().dispatch(setKeyword(keyword, true));
    getStore().dispatch(search(this.client, keyword));
  }

}