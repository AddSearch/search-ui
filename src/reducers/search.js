import { WARMUP_QUERY_PREFIX } from '../index';
import {
  SEARCH_FETCH_START,
  SEARCH_RESULTS
} from '../actions/search';

const initialState = {
  keyword: null,
  results: {},
  loading: false
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case SEARCH_FETCH_START:
      return Object.assign({}, state, {
        loading: true
      });

    case SEARCH_RESULTS:
      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0) {
        return Object.assign({}, state, {
          loading: false
        });
      }

      return Object.assign({}, state, {
        keyword: action.keyword,
        results: action.results,
        loading: false
      });

    default:
      return state;
  }
}