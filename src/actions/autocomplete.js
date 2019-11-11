export const AUTOCOMPLETE_SUGGESTIONS_RESULTS = 'AUTOCOMPLETE_SUGGESTIONS_RESULTS';
export const CLEAR_AUTOCOMPLETE_SUGGESTIONS_RESULTS = 'CLEAR_AUTOCOMPLETE_SUGGESTIONS_RESULTS';
export const AUTOCOMPLETE_SEARCH_RESULTS = 'AUTOCOMPLETE_SEARCH_RESULTS';
export const CLEAR_AUTOCOMPLETE_SEARCH_RESULTS = 'CLEAR_AUTOCOMPLETE_SEARCH_RESULTS';


export function autocompleteSuggestions(client, keyword) {
  if (!keyword || keyword === '') {
    return {
      type: CLEAR_AUTOCOMPLETE_SUGGESTIONS_RESULTS
    }
  }
  return dispatch => {
    client.suggestions(keyword, (res) => dispatch(autocompleteSuggestionsResults(res)));
  }
}

export function autocompleteSuggestionsResults(results) {
  return {
    type: AUTOCOMPLETE_SUGGESTIONS_RESULTS,
    results
  }
}

export function autocompleteSearch(client, keyword) {
  if (!keyword || keyword === '') {
    return {
      type: CLEAR_AUTOCOMPLETE_SEARCH_RESULTS
    }
  }
  return dispatch => {
    client.search(keyword, (res) => dispatch(autocompleteSearchResults(res)));
  }
}


export function autocompleteSearchResults(results) {
  return {
    type: AUTOCOMPLETE_SEARCH_RESULTS,
    results
  }
}