import reducers from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export function initRedux(settings) {
  const preloadedstate = {
    configuration: settings
  };
  let composeEnhancers = compose;
  if (settings.debug && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  return createStore(reducers, preloadedstate, composeEnhancers(applyMiddleware(thunk)));
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
