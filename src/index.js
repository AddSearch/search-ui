import handlebars from 'handlebars';
import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import FilterGroup from './components/filtergroup';
import Pagination from './components/pagination';
import oa from 'es6-object-assign';
import { getStore, observeStoreByKey } from './store';
import { initFromURL } from './util/history';

// Static polyfills and helpers
oa.polyfill();
handlebars.registerHelper('equals', function(arg1, arg2, options) {
  return ((arg1+'') === (arg2+'')) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('gt', function(arg1, arg2, options) {
  return arg1 > arg2 ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('lt', function(arg1, arg2, options) {
  return arg1 < arg2 ? options.fn(this) : options.inverse(this);
});


export const WARMUP_QUERY_PREFIX = '_addsearch_';

export default class SearchUI {

  constructor(client, settings){
    this.client = client;
    this.settings = settings || {};

    initFromURL(this.client);
  }


  /**
   * Add a search bar
   */
  searchBar(conf) {
    const searchbar = new SearchBar(this.client, this.settings, conf);
    searchbar.render();

    observeStoreByKey(getStore(), 'keyword',
      (s) => {
        this.log('Search bar: Keyword changed to ' + s.value + '. Re-rendering');
        searchbar.render(s.value);
      }
    );
  }


  searchResults(conf) {
    this.searchResultsConf = conf;

    const self = this;
    observeStoreByKey(getStore(), 'search',
      (s) => {
        self.resultsCallback(s, self);
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


  /**
   * Callback function when the search returns
   */
  resultsCallback(searchResults, scope) {
    if (scope.searchResultsConf && !searchResults.loading) {
      const t = (new Date()).getTime();
      this.log('Search results: Received search results. Rendering..');
      this.log(searchResults);
      const searchresults = new SearchResults();
      searchresults.render(searchResults.results, scope.searchResultsConf);
      this.log('Search results: done in ' + ((new Date()).getTime() - t) + 'ms');
    }
  }


  log(msg) {
    if (this.settings.debug) {
      console.log(msg);
    }
  }
}