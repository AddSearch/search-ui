import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import FilterGroup from './components/filtergroup';
import oa from 'es6-object-assign';
import { getStore, observeStoreByKey } from './store';
oa.polyfill();

export const WARMUP_QUERY_PREFIX = '_addsearch_';

observeStoreByKey(getStore(), 'keyword', s => console.log('Keyword changed: ' + JSON.stringify(s)));
observeStoreByKey(getStore(), 'suggestions', s => console.log('Suggestions received: ' + JSON.stringify(s)));

export default class SearchUI {

  constructor(client, settings){
    this.client = client;
    this.settings = settings || {};
  }


  /**
   * Add a search bar
   */
  searchBar(searchBarConf) {
    const searchbar = new SearchBar(this.client, this.settings, searchBarConf);
    searchbar.render();
  }


  /**
   * Add a search bar
   */
  searchResults(searchResultsConf) {
    this.searchResultsConf = searchResultsConf;

    const self = this;
    observeStoreByKey(getStore(), 'search',
      (s) => {
        self.resultsCallback(s, self);
      }
    );
  }


  filterGroup(filterGroupConf) {
    const filterGroup = new FilterGroup(this.client, filterGroupConf);
    filterGroup.render([]);

    observeStoreByKey(getStore(), 'filters',
      (s) => {
      console.log(s);
        const active = s.filters ? s.filters.split(',') : [];
        this.log('Filters changed. Re-render')
        filterGroup.render(active);
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