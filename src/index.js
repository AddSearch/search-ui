import './index.scss';
import handlebars from 'handlebars';
import oa from 'es6-object-assign';

import FacetGroup from './components/facetgroup';
import FilterGroup from './components/filtergroup';
import Pagination from './components/pagination';
import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import { getStore, observeStoreByKey } from './store';
import { initFromURL } from './util/history';
import { search } from './actions/search';
import { setKeyword } from './actions/keyword';

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
    initFromURL(this.client);

    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }
  }


  matchAllQuery() {
    const store = getStore();
    if (store.getState().keyword.value === '') {
      store.dispatch(setKeyword(MATCH_ALL_QUERY, false));
      store.dispatch(search(this.client, MATCH_ALL_QUERY));
    }
  }


  /**
   * Add a search bar
   */
  searchBar(conf) {
    const searchbar = new SearchBar(this.client, this.settings, conf);
    searchbar.render();

    observeStoreByKey(getStore(), 'keyword',
      (s) => {
        if (s.externallySet === true) {
          this.log('Search bar: Keyword changed to ' + s.value + '. Re-rendering');
          searchbar.render(s.value === MATCH_ALL_QUERY ? '' : s.value);
        }
      }
    );
  }


  searchResults(conf) {
    const searchresults = new SearchResults(conf);

    observeStoreByKey(getStore(), 'search',
      (s) => {
        if (!s.loading) {
          const t = (new Date()).getTime();
          this.log('Search results: Received search results. Rendering..');
          searchresults.render(s);
          this.log('Search results: done in ' + ((new Date()).getTime() - t) + 'ms');
        }
      }
    );
  }


  facetGroup(conf) {
    if (!this.facetGroups) {
      this.facetGroups = [];
    }

    const facetGroup = new FacetGroup(this.client, conf);
    this.facetGroups.push(facetGroup);
    facetGroup.render();

    observeStoreByKey(getStore(), 'search',
      (s) => {
        const facets = s.results && s.results.facets ? s.results.facets : {};
        this.facetGroups.forEach(fg => {
          fg.render(facets[fg.getFieldName()]);
        });
      }
    );
  }

  filterGroup(conf) {
    const filterGroup = new FilterGroup(this.client, conf);
    filterGroup.render([]);

    observeStoreByKey(getStore(), 'filters',
      (s) => {
        const active = s.filters ? s.filters.split(',') : null;
        this.log('Filters: Active filters changed to ' + active + '. Re-rendering')
        filterGroup.render(active);
      }
    );
  }


  pagination(conf) {
    const pagination = new Pagination(this.client, conf);
    pagination.render(1, 0, 10);

    observeStoreByKey(getStore(), 'search',
      (s) => {
        if (s.loading !== true) {
          const currentPage = getStore().getState().pagination.page || 1;
          const resultCount = s.results.total_hits || 0;
          pagination.render(currentPage, resultCount, 10);
        }
      }
    );
  }


  log(msg) {
    if (this.settings.debug) {
      console.log(msg);
    }
  }
}