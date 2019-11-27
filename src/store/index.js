import reducers from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

let store;

export function initRedux(settings) {
  if (settings.reduxStore) {
    store = reduxStore;
  }
  else {
    let composeEnhancers = compose;
    if (settings.debug && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
    store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
  }
}


export function getStore() {
  return store
}


export function observeStoreByKey(store, jsonKey, onChange) {
  let currentState = {};

  function handleChange() {
    const nextState = store.getState()[jsonKey];
    if (JSON.stringify(nextState) !== JSON.stringify(currentState[jsonKey])) {
      currentState[jsonKey] = nextState;
      onChange(currentState[jsonKey]);
    }
  }

  let unsubs = store.subscribe(handleChange);
  handleChange();
  return unsubs;
}