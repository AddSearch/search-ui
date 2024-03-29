import { WARMUP_QUERY_PREFIX } from '../index';
import {
  START,
  SEARCH_FETCH_START,
  SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_RESULTS_PAGE_URL,
  SEARCH_BY_COMPONENT
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
        loading: false,
        dropReturningResults: true // Don't render pending results returning after clear
      });

    case SEARCH_FETCH_START:
      return Object.assign({}, state, {
        loading: true,
        dropReturningResults: false
      });

    case SEARCH_RESULTS:
      if (!state.started) {
        console.log('WARNING: AddSearch UI not started with the start() function');
      }

      if (state.dropReturningResults === true) {
        return state;
      }

      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0) {
        return Object.assign({}, state, {
          loading: false
        });
      }

      let nextResults = action.results;

      // If append mode (e.g. infinite scroll) keep old hits as well
      if (action.appendResults === true && state.results.hits) {
        const allHits = [...state.results.hits, ...action.results.hits];
        nextResults.hits = allHits;
      }

      return Object.assign({}, state, {
        keyword: action.keyword,
        results: nextResults,
        loading: false,
        callBy: action.requestBy
      });

    case SET_SEARCH_RESULTS_PAGE_URL:
      return Object.assign({}, state, {
        searchResultsPageUrl: action.url
      });

    default:
      return state;
  }
}
