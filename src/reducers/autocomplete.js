import {
  AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  AUTOCOMPLETE_SEARCH_RESULTS,
  CLEAR_AUTOCOMPLETE_SEARCH_RESULTS
} from '../actions/autocomplete';

const initialState = {
  suggestions: [],
  searchResults: []
};

export default function searchsuggestions(state = initialState, action) {
  switch (action.type) {
    case CLEAR_AUTOCOMPLETE_SUGGESTIONS_RESULTS:
      return Object.assign({}, state, {
        suggestions: []
      });

    case AUTOCOMPLETE_SUGGESTIONS_RESULTS:
      return Object.assign({}, state, {
        suggestions: action.results.suggestions
      });

    case CLEAR_AUTOCOMPLETE_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: []
      });

    case AUTOCOMPLETE_SEARCH_RESULTS:
      return Object.assign({}, state, {
        searchResults: action.results.hits
      });

    default:
      return state;
  }
}