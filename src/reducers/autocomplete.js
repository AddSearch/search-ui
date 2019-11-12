import {
  AUTOCOMPLETE_FETCH,
  AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  AUTOCOMPLETE_SUGGESTIONS_CLEAR,
  AUTOCOMPLETE_SEARCH_RESULTS,
  AUTOCOMPLETE_SEARCH_CLEAR
} from '../actions/autocomplete';

const initialState = {
  pendingRequests: 0,
  suggestions: [],
  searchResults: {}
};

export default function searchsuggestions(state = initialState, action) {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH:
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests + 1
      });

    case AUTOCOMPLETE_SUGGESTIONS_CLEAR:
      return Object.assign({}, state, {
        suggestions: []
      });

    case AUTOCOMPLETE_SUGGESTIONS_RESULTS:
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests - 1,
        suggestions: action.results.suggestions
      });

    case AUTOCOMPLETE_SEARCH_CLEAR:
      return Object.assign({}, state, {
        searchResults: {}
      });

    case AUTOCOMPLETE_SEARCH_RESULTS:
      const nextSearchResults = Object.assign({}, state.searchResults);
      nextSearchResults[action.jsonKey] = action.results.hits;
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests - 1,
        searchResults: nextSearchResults
      });

    default:
      return state;
  }
}