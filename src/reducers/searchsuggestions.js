import {
  SUGGESTION_RESULTS,
  CLEAR_SUGGESTIONS
} from '../actions/searchsuggestions';

const initialState = {
  suggestions: []
};

export default function searchsuggestions(state = initialState, action) {
  switch (action.type) {
    case CLEAR_SUGGESTIONS:
      return Object.assign({}, initialState);

    case SUGGESTION_RESULTS:
      return Object.assign({}, state, {
        keyword: action.keyword,
        suggestions: action.results.suggestions
      });

    default:
      return state;
  }
}