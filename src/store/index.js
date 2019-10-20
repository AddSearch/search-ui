import reducers from '../reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


const store = createStore(reducers, applyMiddleware(thunk));
console.log('store initialized');

export function getStore() {
  return store
}


export function observeStoreByKey(store, jsonKey, onChange) {
  let currentState = {};

  function handleChange() {
    const nextState = store.getState()[jsonKey];
    if (nextState !== currentState[jsonKey]) {
      currentState[jsonKey] = nextState;
      onChange(currentState[jsonKey]);
    }
  }

  let unsubs = store.subscribe(handleChange);
  handleChange();
  return unsubs;
}