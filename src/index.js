import './index.scss';
import handlebars from 'handlebars';
import oa from 'es6-object-assign';

import FacetGroup from './components/facetgroup';
import FilterGroup from './components/filtergroup';
import Pagination from './components/pagination';
import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import SortBy from './components/sortby';
import { getStore, observeStoreByKey } from './store';
import { initFromURL } from './util/history';
import { search } from './actions/search';
import { setKeyword } from './actions/keyword';
import { sortBy } from './actions/sortby';

// Static polyfills and helpers
oa.polyfill();
handlebars.registerHelper('equals', (arg1, arg2, options) => {
  return ((arg1+'') === (arg2+'')) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('gt', (arg1, arg2, options) => {
  return arg1 > arg2 ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('lt', (arg1, arg2, options) => {
  return arg1 < arg2 ? options.fn(this) : options.inverse(this);
});


export const WARMUP_QUERY_PREFIX = '_addsearch_';
export const MATCH_ALL_QUERY = '*';

export default class SearchUI {

  constructor(client, settings) {
    this.client = client;
    this.settings = settings || {};

    this.initFromClientSettings();
    initFromURL(this.client);


    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }
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

  searchResults(conf) {
    const searchresults = new SearchResults(conf);
    searchresults.render();
  }

  facetGroup(conf) {
    const facetGroup = new FacetGroup(this.client, conf);
    facetGroup.render();
  }

  filterGroup(conf) {
    const filterGroup = new FilterGroup(this.client, conf);
    filterGroup.render();
  }

  sortBy(conf) {
    const sortby = new SortBy(this.client, conf);
    sortby.render();
  }

  pagination(conf) {
    const pagination = new Pagination(this.client, conf);
    pagination.render();
  }
}