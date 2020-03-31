export const SEGMENTED_SEARCH_START = 'SEGMENTED_SEARCH_START';
export const SEGMENTED_SEARCH_RESULTS = 'SEGMENTED_SEARCH_RESULTS';

export function segmentedSearch(client, jsonKey, keyword) {
  return dispatch => {
    dispatch(segmentedSearchStart(jsonKey));
    client.search(keyword, (res) => dispatch(segmentedSearchResults(jsonKey, keyword, res)));
  }
}


export function segmentedSearchStart(jsonKey) {
  return {
    type: SEGMENTED_SEARCH_START,
    jsonKey
  }
}


export function segmentedSearchResults(jsonKey, keyword, results) {
  return {
    type: SEGMENTED_SEARCH_RESULTS,
    jsonKey,
    keyword,
    results
  }
}