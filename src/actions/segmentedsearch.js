export const SEGMENTED_SEARCH_START = 'SEGMENTED_SEARCH_START';
export const SEGMENTED_SEARCH_RESULTS = 'SEGMENTED_SEARCH_RESULTS';

export function segmentedSearch(client, jsonKey, keyword) {
  return dispatch => {
    dispatch(segmentedSearchStart());
    client.search(keyword, (res) => dispatch(segmentedSearchResults(jsonKey, keyword, res)));
  }
}


export function segmentedSearchStart() {
  return {
    type: SEGMENTED_SEARCH_START
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