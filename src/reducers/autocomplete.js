import {
  AUTOCOMPLETE_FETCH_START,
  AUTOCOMPLETE_SUGGESTIONS_RESULTS,
  AUTOCOMPLETE_CUSTOM_FIELDS_RESULTS,
  AUTOCOMPLETE_SUGGESTIONS_CLEAR,
  AUTOCOMPLETE_CUSTOM_FIELDS_CLEAR,
  AUTOCOMPLETE_SEARCH_RESULTS,
  AUTOCOMPLETE_SEARCH_CLEAR,
  AUTOCOMPLETE_SHOW,
  AUTOCOMPLETE_HIDE,
  HIDE_AUTOMATICALLY,
  KEYBOARD_EVENT,
  ARROW_UP,
  ARROW_DOWN,
  SET_ACTIVE_SUGGESTION,
  SUGGESTIONS_JSON_KEY,
  AUTOCOMPLETE_HIDE_AND_DROP_RENDERING,
  CUSTOM_FIELDS_JSON_KEY,
  AUTOCOMPLETE_MIN_LENGTH_REQUIRED
} from '../actions/autocomplete';

const initialState = {
  pendingRequests: [],
  keyword: null,

  suggestions: [],
  customFields: [],
  activeSuggestionIndex: null,
  setSuggestionToSearchField: false,

  searchResults: {},
  searchResultsStats: {},
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
        activeSuggestionIndex: null,
        pendingRequests: []
      });

    case AUTOCOMPLETE_CUSTOM_FIELDS_CLEAR:
      return Object.assign({}, state, {
        customFields: [],
        activeSuggestionIndex: null,
        pendingRequests: []
      });

    case AUTOCOMPLETE_SUGGESTIONS_RESULTS:
      // Remove suggestion from pending requests
      let removePendingSuggestion = [...state.pendingRequests];
      if (removePendingSuggestion.indexOf(SUGGESTIONS_JSON_KEY) !== -1) {
        removePendingSuggestion.splice(removePendingSuggestion.indexOf(SUGGESTIONS_JSON_KEY), 1);
      }

      return Object.assign({}, state, {
        keyword: action.keyword,
        pendingRequests: removePendingSuggestion,
        suggestions: action.results.suggestions,
        activeSuggestionIndex: null,
        visible: true
      });

    case AUTOCOMPLETE_CUSTOM_FIELDS_RESULTS:
      // Remove suggestion from pending requests
      let removePendingCustomFields = [...state.pendingRequests];
      if (removePendingCustomFields.indexOf(CUSTOM_FIELDS_JSON_KEY) !== -1) {
        removePendingCustomFields.splice(
          removePendingCustomFields.indexOf(CUSTOM_FIELDS_JSON_KEY),
          1
        );
      }

      return Object.assign({}, state, {
        pendingRequests: removePendingCustomFields,
        customFields: action.results.autocomplete,
        activeSuggestionIndex: null,
        visible: true
      });

    case AUTOCOMPLETE_SEARCH_CLEAR:
      return Object.assign({}, state, {
        keyword: '',
        pendingRequests: [],
        searchResults: {},
        searchResultsStats: {}
      });

    case AUTOCOMPLETE_SEARCH_RESULTS:
      const nextSearchResults = Object.assign({}, state.searchResults);
      nextSearchResults[action.jsonKey] = action.results.hits;
      const nextSearchResultsStats = Object.assign({}, state.searchResultsStats);

      // Append results in infinite scroll
      if (action.appendResults === true && state.searchResults[action.jsonKey]) {
        nextSearchResults[action.jsonKey] = [
          ...state.searchResults[action.jsonKey],
          ...action.results.hits
        ];
      }

      // Not infinite scroll. Save stats (number of hits, processing time) for possible analytics usage
      else {
        if (!nextSearchResultsStats[action.jsonKey]) {
          nextSearchResultsStats[action.jsonKey] = {};
        }
        nextSearchResultsStats[action.jsonKey].total_hits = action.results.total_hits;
        nextSearchResultsStats[action.jsonKey].processing_time_ms =
          action.results.processing_time_ms;
      }

      // Remove this search from pending requests
      let removePendingSearch = [...state.pendingRequests];
      if (removePendingSearch.indexOf(action.jsonKey) !== -1) {
        removePendingSearch.splice(removePendingSearch.indexOf(action.jsonKey), 1);
      }

      return Object.assign({}, state, {
        keyword: action.keyword,
        pendingRequests: removePendingSearch,
        searchResults: nextSearchResults,
        searchResultsStats: nextSearchResultsStats,
        visible: true,
        appendResults: action.appendResults === true
      });

    case AUTOCOMPLETE_HIDE:
      return Object.assign({}, state, {
        visible: false,
        activeSuggestionIndex: null
      });

    case AUTOCOMPLETE_HIDE_AND_DROP_RENDERING:
      return Object.assign({}, state, {
        dropRendering: true,
        visible: false,
        activeSuggestionIndex: null
      });

    case AUTOCOMPLETE_SHOW:
      return Object.assign({}, state, {
        visible: true,
        dropRendering: false
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
      let setSuggestionToSearchField = true;

      if (state.suggestions.length && state.customFields.length) {
        nextActiveSuggestion = null;
        setSuggestionToSearchField = false;
      } else {
        const source = state.suggestions.length ? 'suggestions' : 'customFields';
        if (action.direction === ARROW_DOWN) {
          if (nextActiveSuggestion === null && state[source].length > 0) {
            nextActiveSuggestion = 0;
          } else if (nextActiveSuggestion === state[source].length - 1) {
            nextActiveSuggestion = null;
          } else {
            nextActiveSuggestion = nextActiveSuggestion + 1;
          }
        } else if (action.direction === ARROW_UP) {
          if (nextActiveSuggestion === null && state[source].length > 0) {
            nextActiveSuggestion = state[source].length - 1;
          } else if (nextActiveSuggestion === 0) {
            nextActiveSuggestion = null;
          } else {
            nextActiveSuggestion = nextActiveSuggestion - 1;
          }
        }
      }

      return Object.assign({}, state, {
        visible: true,
        activeSuggestionIndex: nextActiveSuggestion,
        setSuggestionToSearchField: true
      });

    case AUTOCOMPLETE_MIN_LENGTH_REQUIRED:
      return Object.assign({}, state, {
        minLengthRequired: action.minLengthRequired
      });

    default:
      return state;
  }
}
