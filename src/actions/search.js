/* global window */
import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SEARCH_FETCH_START = 'SEARCH_FETCH_START';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';


export function search(client, keyword, onResultsScrollTo) {
  // Update browser history
  setHistory(HISTORY_PARAMETERS.SEARCH, keyword);

  // Clear search results if there is no keyword
  if (!keyword || keyword === '') {
    return {
      type: CLEAR_SEARCH_RESULTS
    }
  }
  return dispatch => {
    dispatch(searchFetchStart());
    client.search(keyword, (res) => dispatch(searchResults(keyword, res, onResultsScrollTo)));
  }
}

export function searchFetchStart(keyword) {
  return {
    type: SEARCH_FETCH_START
  }
}

export function searchResults(keyword, results, onResultsScrollTo) {
  if (onResultsScrollTo === 'top') {
    window.scrollTo(0, 0);
  }

  return {
    type: SEARCH_RESULTS,
    keyword,
    results
  }
}

export function clearSearchResults(scrollTo) {
  if (scrollTo === 'top') {
    window.scrollTo(0, 0);
  }

  return {
    type: CLEAR_SEARCH_RESULTS
  }
}