/*
 * action types
 */
export const KEYWORD = 'KEYWORD';

export const SEARCH = 'SEARCH';
export const SEARCH_FETCH_START = 'SEARCH_FETCH_START';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';


/*
 * action creators
 */
export function setKeyword(value) {
  return { type: KEYWORD, value }
}

export function search(client, keyword) {
  return dispatch => {
    dispatch(searchFetchStart());
    client.search(keyword, (res) => dispatch(searchResults(res)));
  }
}

export function searchFetchStart() {
  return {
    type: SEARCH_FETCH_START
  }
}

export function searchResults(results) {
  return {
    type: SEARCH_RESULTS,
    results
  }
}