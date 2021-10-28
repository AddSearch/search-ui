export const AUTOCOMPLETE_FETCH_START = 'AUTOCOMPLETE_FETCH_START';
export const AUTOCOMPLETE_SUGGESTIONS_RESULTS = 'AUTOCOMPLETE_SUGGESTIONS_RESULTS';
export const AUTOCOMPLETE_CUSTOM_FIELDS_RESULTS = 'AUTOCOMPLETE_CUSTOM_FIELDS_RESULTS';
export const AUTOCOMPLETE_SUGGESTIONS_CLEAR = 'AUTOCOMPLETE_SUGGESTIONS_CLEAR';
export const AUTOCOMPLETE_CUSTOM_FIELDS_CLEAR = 'AUTOCOMPLETE_CUSTOM_FIELDS_CLEAR';
export const AUTOCOMPLETE_SEARCH_RESULTS = 'AUTOCOMPLETE_SEARCH_RESULTS';
export const AUTOCOMPLETE_SEARCH_CLEAR = 'AUTOCOMPLETE_SEARCH_CLEAR';
export const AUTOCOMPLETE_SHOW = 'AUTOCOMPLETE_SHOW';
export const AUTOCOMPLETE_HIDE = 'AUTOCOMPLETE_HIDE';
export const AUTOCOMPLETE_HIDE_AND_DROP_RENDERING = 'AUTOCOMPLETE_HIDE_AND_DROP_RENDERING';
export const HIDE_AUTOMATICALLY = 'HIDE_AUTOMATICALLY';

export const KEYBOARD_EVENT = 'KEYBOARD_EVENT';
export const ARROW_UP = 'ARROW_UP';
export const ARROW_DOWN = 'ARROW_DOWN';
export const SET_ACTIVE_SUGGESTION = 'SET_ACTIVE_SUGGESTION';

export const SUGGESTIONS_JSON_KEY = 'suggestions';
export const CUSTOM_FIELDS_JSON_KEY = 'custom_fields';

export function autocompleteSuggestions(client, keyword) {
  if (!keyword || keyword === '') {
    return {
      type: AUTOCOMPLETE_SUGGESTIONS_CLEAR
    }
  }
  return dispatch => {
    dispatch(autocompleteFetchStart(SUGGESTIONS_JSON_KEY));
    client.suggestions(keyword, (res) => dispatch(autocompleteSuggestionsResults(keyword, res)));
  }
}

export function autocompleteCustomFields(client, keyword, field) {
  if (!keyword || keyword === '') {
    return {
      type: AUTOCOMPLETE_CUSTOM_FIELDS_CLEAR
    }
  }
  return dispatch => {
    dispatch(autocompleteFetchStart(CUSTOM_FIELDS_JSON_KEY));
    client.autocomplete(field, keyword, (res) => dispatch(autocompleteCustomFieldsResults(res)));

  }
}

export function autocompleteSuggestionsResults(keyword, results) {
  return {
    type: AUTOCOMPLETE_SUGGESTIONS_RESULTS,
    keyword,
    results
  }
}

export function autocompleteCustomFieldsResults(results) {
  return {
    type: AUTOCOMPLETE_CUSTOM_FIELDS_RESULTS,
    results
  }
}

export function autocompleteSearch(client, jsonKey, keyword, appendResults) {
  if (!keyword || keyword === '') {
    return {
      type: AUTOCOMPLETE_SEARCH_CLEAR
    }
  }
  return dispatch => {
    dispatch(autocompleteFetchStart(jsonKey));
    client.search(keyword, (res) => dispatch(autocompleteSearchResults(keyword, res, jsonKey, appendResults)));
  }
}

export function autocompleteSearchResults(keyword, results, jsonKey, appendResults) {
  return {
    type: AUTOCOMPLETE_SEARCH_RESULTS,
    keyword,
    results,
    jsonKey,
    appendResults
  }
}

export function autocompleteFetchStart(jsonKey) {
  return {
    type: AUTOCOMPLETE_FETCH_START,
    jsonKey
  }
}

export function autocompleteShow() {
  return {
    type: AUTOCOMPLETE_SHOW
  }
}

export function autocompleteHide() {
  return {
    type: AUTOCOMPLETE_HIDE
  }
}

export function autocomplteHideAndDropRendering() {
  return {
    type: AUTOCOMPLETE_HIDE_AND_DROP_RENDERING
  }
}

export function keyboardEvent(direction) {
  return {
    type: KEYBOARD_EVENT,
    direction
  }
}

export function setActiveSuggestion(index, setSuggestionToSearchField) {
  return {
    type: SET_ACTIVE_SUGGESTION,
    index,
    setSuggestionToSearchField
  }
}

export function setHideAutomatically(hideAutomatically) {
  return {
    type: HIDE_AUTOMATICALLY,
    hideAutomatically
  }
}
