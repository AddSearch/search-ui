/* global window */
import { WARMUP_QUERY_PREFIX } from '../index';
import { setHistory, HISTORY_PARAMETERS } from '../util/history';
import { sendSearchStats } from '../util/analytics';

export const START = 'START';
export const SET_SEARCH_RESULTS_PAGE_URL = 'SET_SEARCH_RESULTS_PAGE_URL';
export const SEARCH_FETCH_START = 'SEARCH_FETCH_START';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

export function start() {
  return {
    type: START
  }
}

export function search(client, keyword, onResultsScrollTo, appendResults) {
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
    client.search(keyword, (res) => dispatch(searchResults(client, keyword, res, onResultsScrollTo, appendResults)));
  }
}

export function searchFetchStart(keyword) {
  return {
    type: SEARCH_FETCH_START
  }
}

export function searchResults(client, keyword, results, onResultsScrollTo, appendResults) {
  if (onResultsScrollTo === 'top') {
    window.scrollTo(0, 0);
  }

  // Feed stats if not a warmup query
  if (keyword && keyword.indexOf(WARMUP_QUERY_PREFIX) === -1) {
    const hits = results ? results.total_hits : 0;
    const time = results ? results.processing_time_ms : 0;
    sendSearchStats(client, keyword, hits, time);
  }

  return {
    type: SEARCH_RESULTS,
    keyword,
    results,
    appendResults
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

export function setSearchResultsPageUrl(url) {
  return {
    type: SET_SEARCH_RESULTS_PAGE_URL,
    url
  }
}