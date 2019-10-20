import { combineReducers } from 'redux'
import {
  KEYWORD,
  SEARCH_FETCH_START,
  SEARCH_RESULTS
} from './actions';

const initialState = {
  loading: false,
  keyword: '',
  results: {}
};

function keyup(state = initialState, action) {
  //console.log('ACTION IN REDUCER');
  //console.log(action);

  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        keyword: action.value
      });

    case SEARCH_FETCH_START:
      return Object.assign({}, state, {
        loading: true
      });

    case SEARCH_RESULTS:
      return Object.assign({}, state, {
        loading: false,
        results: action.results
      });

    default:
      return state
  }
}

const reducers = combineReducers({
  keyup
});

export default reducers;