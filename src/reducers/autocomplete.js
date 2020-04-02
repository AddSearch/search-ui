import {
  AUTOCOMPLETE_FETCH_START,
  AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  AUTOCOMPLETE_SUGGESTIONS_CLEAR,
  AUTOCOMPLETE_SEARCH_RESULTS,
  AUTOCOMPLETE_SEARCH_CLEAR,
  AUTOCOMPLETE_SHOW,
  AUTOCOMPLETE_HIDE,
  HIDE_AUTOMATICALLY,
  KEYBOARD_EVENT, ARROW_UP, ARROW_DOWN,
  SET_ACTIVE_SUGGESTION,
  SUGGESTIONS_JSON_KEY
} from '../actions/autocomplete';

const initialState = {
  pendingRequests: [],

  suggestions: [],
  activeSuggestionIndex: null,
  setSuggestionToSearchField: false,

  searchResults: {},
  hideAutomatically: true,
  visible: false
};

export default function searchsuggestions(state = initialState, action) {
  switch (action.type) {
    case AUTOCOMPLETE_FETCH_START:
      // Add to pending requests
      let addPendingReq = [...state.pendingRequests];
      if (addPendingReq.indexOf(action.jsonKey) === -1) {
        addPendingReq.push(action.jsonKey);
      }

      return Object.assign({}, state, {
        pendingRequests: addPendingReq
      });


    case AUTOCOMPLETE_SUGGESTIONS_CLEAR:
      return Object.assign({}, state, {
        suggestions: [],
        activeSuggestionIndex: null
      });


    case AUTOCOMPLETE_SUGGESTIONS_RESULTS:

      // Remove suggestion from pending requests
      let removePendingSuggestion = [...state.pendingRequests];
      if (removePendingSuggestion.indexOf(SUGGESTIONS_JSON_KEY) !== -1) {
        removePendingSuggestion.splice(removePendingSuggestion.indexOf(SUGGESTIONS_JSON_KEY), 1);
      }

      return Object.assign({}, state, {
        pendingRequests: removePendingSuggestion,
        suggestions: action.results.suggestions,
        activeSuggestionIndex: null,
        visible: true
      });


    case AUTOCOMPLETE_SEARCH_CLEAR:
      return Object.assign({}, state, {
        searchResults: {}
      });


    case AUTOCOMPLETE_SEARCH_RESULTS:
      const nextSearchResults = Object.assign({}, state.searchResults);
      nextSearchResults[action.jsonKey] = action.results.hits;

      // Append results in infinite scroll
      if (action.appendResults === true && state.searchResults[action.jsonKey]) {
        nextSearchResults[action.jsonKey] = [...state.searchResults[action.jsonKey], ...action.results.hits];
      }

      // Remove search from pending requests
      let removePendingSearch = [...state.pendingRequests];
      if (removePendingSearch.indexOf(action.jsonKey) !== -1) {
        removePendingSearch.splice(removePendingSearch.indexOf(action.jsonKey), 1);
      }

      return Object.assign({}, state, {
        pendingRequests: removePendingSearch,
        searchResults: nextSearchResults,
        visible: true,
        appendResults: action.appendResults === true
      });


    case AUTOCOMPLETE_HIDE:
      return Object.assign({}, state, {
        visible: false,
        activeSuggestionIndex: null
      });


    case AUTOCOMPLETE_SHOW:
      return Object.assign({}, state, {
        visible: true
      });


    case HIDE_AUTOMATICALLY:
      return Object.assign({}, state, {
        hideAutomatically: action.hideAutomatically
      });


    case SET_ACTIVE_SUGGESTION:
      return Object.assign({}, state, {
        activeSuggestionIndex: action.index,
        setSuggestionToSearchField: action.setSuggestionToSearchField
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
        visible: true,
        activeSuggestionIndex: nextActiveSuggestion,
        setSuggestionToSearchField: true
      });

    default:
      return state;
  }
}