export const SUGGESTION_RESULTS = 'SUGGESTION_RESULTS';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';


export function getSuggestions(client, keyword) {
  if (!keyword || keyword === '') {
    return {
      type: CLEAR_SUGGESTIONS
    }
  }
  return dispatch => {
    client.suggestions(keyword, (res) => dispatch(suggestionResults(keyword, res)));
  }
}

export function suggestionResults(keyword, results) {
  return {
    type: SUGGESTION_RESULTS,
    keyword,
    results
  }
}