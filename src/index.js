import SearchBar from './searchbar/searchbar';
import searchresults from './searchresults';

import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const store = createStore(reducers, applyMiddleware(thunk));

//store.subscribe(() => console.log(store.getState()));

export function getStore() {
  return store;
}

function observeStore(store, select, onChange, key) {
  let currentState = {};

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState[key]) {
      console.log('State changed for ' + key);
      currentState[key] = nextState;
      onChange(currentState);
    }
    else {
      console.log('State unchanged for ' + key);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
observeStore(getStore(), state => { return state.keyup.keyword; }, s => console.log('Keyword changed: ' + JSON.stringify(s)), 'keyword');

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
    observeStore(getStore(), state => { return state.keyup.results; },
      (s) => {
        console.log('Render results!');
        console.log(JSON.stringify(s));
        self.resultsCallback(s, self);
      },
      'results'

    );

  }



  /**
   * Callback function when the search returns
   */
  resultsCallback(results, scope) {
    if (scope.searchResultsConf) {
      console.log('rendering results');
      searchresults(results, scope.searchResultsConf);
    }
  }
}

// module.exports = searchui;