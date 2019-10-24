/* global window */
import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SEARCH_NO_KEYWORD = 'SEARCH_NO_KEYWORD';
export const SEARCH_FETCH_START = 'SEARCH_FETCH_START';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';


export function search(client, keyword, onResultsScrollTo) {
  // Don't search if there is no keyword
  if (!keyword || keyword === '') {
    return {
      type: SEARCH_NO_KEYWORD
    }
  }
  return dispatch => {
    setHistory(HISTORY_PARAMETERS.SEARCH, keyword);
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