import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import oa from 'es6-object-assign';
import { getStore, observeStoreByKey } from './store';
oa.polyfill();


observeStoreByKey(getStore(), 'keyword', s => console.log('Keyword changed: ' + JSON.stringify(s)));
observeStoreByKey(getStore(), 'suggestions', s => console.log('Suggestions received: ' + JSON.stringify(s)));

export default class SearchUI {

  constructor(client){
    this.client = client;
    this.searchResultsConf = null;
  }


  /**
   * Add a search bar
   */
  searchBar(conf) {
    const searchbar = new SearchBar();
    searchbar.render(this.client, conf);
  }


  /**
   * Add a search bar
   */
  searchResults(conf) {
    this.searchResultsConf = conf;

    const self = this;
    observeStoreByKey(getStore(), 'search',
      (s) => {
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