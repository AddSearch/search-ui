import { WARMUP_QUERY_PREFIX } from '../index';
import {
  START,
  SEARCH_FETCH_START,
  SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_RESULTS_PAGE_URL
} from '../actions/search';

const initialState = {
  started: false,
  keyword: null,
  results: {},
  loading: false,
  searchResultsPageUrl: null // Redir to a search page instead of executing API call
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case START:
      return Object.assign({}, state, {
        started: true
      });

    case CLEAR_SEARCH_RESULTS:
      return Object.assign({}, state, {
        keyword: null,
        results: {},
        loading: false
      });

    case SEARCH_FETCH_START:
      return Object.assign({}, state, {
        loading: true
      });

    case SEARCH_RESULTS:
      if (!state.started) {
        console.log('WARNING: AddSearch UI not started with the start() function');
      }

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

    case SET_SEARCH_RESULTS_PAGE_URL:
      return Object.assign({}, state, {
        searchResultsPageUrl: action.url
      });

    default:
      return state;
  }
}