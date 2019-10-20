import {
  SEARCH_FETCH_START,
  SEARCH_RESULTS
} from '../actions/search';

const initialState = {
  loading: false,
  results: {}
};

export default function search(state = initialState, action) {

  switch (action.type) {
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