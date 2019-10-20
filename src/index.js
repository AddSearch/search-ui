import SearchBar from './searchbar/searchbar';
import SearchResults from './searchresults';

import { getStore, observeStoreByKey } from './store';

observeStoreByKey(getStore(), 'keyword', s => console.log('Keyword changed: ' + JSON.stringify(s)));

export default class SearchUI {

  constructor(client){
    this.client = client;
    this.searchResultsConf = null;
  }


  /**
   * Add a search bar
   */
  searchBar(conf) {
    /*const self = this;
    const cb = function(results) {
      self.resultsCallback(results, self)
    }*/

    const searchbar = new SearchBar();
    searchbar.render(this.client, () => {}, conf);
  }


  /**
   * Add a search bar
   */
  searchResults(conf) {
    this.searchResultsConf = conf;

    const self = this;
    observeStoreByKey(getStore(), 'search',
      (s) => {
        console.log('Render results!');
        console.log(JSON.stringify(s));
        self.resultsCallback(s, self);
      }
    );

  }



  /**
   * Callback function when the search returns
   */
  resultsCallback(search, scope) {
    if (scope.searchResultsConf && !search.loading) {
      console.log('rendering results');
      const searchresults = new SearchResults();
      searchresults.render(search.results, scope.searchResultsConf);
    }
  }
}