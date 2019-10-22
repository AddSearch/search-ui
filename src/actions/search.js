import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SEARCH_FETCH_START = 'SEARCH_FETCH_START';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';


export function search(client, keyword) {
  return dispatch => {
    setHistory(HISTORY_PARAMETERS.SEARCH, keyword);
    dispatch(searchFetchStart());
    client.search(keyword, (res) => dispatch(searchResults(keyword, res)));
  }
}

export function searchFetchStart(keyword) {
  return {
    type: SEARCH_FETCH_START
  }
}

export function searchResults(keyword, results) {
  return {
    type: SEARCH_RESULTS,
    keyword,
    results
  }
}