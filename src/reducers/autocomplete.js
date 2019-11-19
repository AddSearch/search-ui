import {
  AUTOCOMPLETE_FETCH,
  AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  AUTOCOMPLETE_SUGGESTIONS_CLEAR,
  AUTOCOMPLETE_SEARCH_RESULTS,
  AUTOCOMPLETE_SEARCH_CLEAR,
  AUTOCOMPLETE_HIDE,
  KEYBOARD_EVENT, ARROW_UP, ARROW_DOWN,
  SET_ACTIVE_SUGGESTION
} from '../actions/autocomplete';

const initialState = {
  pendingRequests: 0,

  suggestions: [],
  activeSuggestionIndex: null,
  setSuggestionToSearchField: false,

  searchResults: {},
  hide: false
};

export default function searchsuggestions(state = initialState, action) {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH:
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests + 1
      });

    case AUTOCOMPLETE_SUGGESTIONS_CLEAR:
      return Object.assign({}, state, {
        suggestions: [],
        activeSuggestionIndex: null
      });

    case AUTOCOMPLETE_SUGGESTIONS_RESULTS:
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests - 1,
        suggestions: action.results.suggestions,
        activeSuggestionIndex: null,
        hide: false
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
        searchResults: nextSearchResults,
        hide: false
      });

    case AUTOCOMPLETE_HIDE:
      return Object.assign({}, state, {
        hide: true,
        activeSuggestionIndex: null
      });

    case SET_ACTIVE_SUGGESTION:
      return Object.assign({}, state, {
        activeSuggestionIndex: action.index,
        setSuggestionToSearchField: false
      });

    case KEYBOARD_EVENT:
      let nextActiveSuggestion = state.activeSuggestionIndex;
      if (action.direction === ARROW_DOWN) {
        if (nextActiveSuggestion === null && state.suggestions.length > 0) {
          nextActiveSuggestion = 0;
        }
        else if (nextActiveSuggestion === state.suggestions.length-1) {
          nextActiveSuggestion = null;
        }
        else {
          nextActiveSuggestion = nextActiveSuggestion + 1;
        }
      }
      else if (action.direction === ARROW_UP) {
        if (nextActiveSuggestion === null && state.suggestions.length > 0) {
          nextActiveSuggestion = state.suggestions.length-1;
        }
        else if (nextActiveSuggestion === 0) {
          nextActiveSuggestion = null;
        }
        else {
          nextActiveSuggestion = nextActiveSuggestion - 1;
        }
      }

      return Object.assign({}, state, {
        hide: false,
        activeSuggestionIndex: nextActiveSuggestion,
        setSuggestionToSearchField: true
      });

    default:
      return state;
  }
}