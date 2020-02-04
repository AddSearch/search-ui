export const SEGMENTED_SEARCH_RESULTS = 'SEGMENTED_SEARCH_RESULTS';

export function segmentedSearch(client, jsonKey, keyword) {
  return dispatch => {
    client.search(keyword, (res) => dispatch(segmentedSearchResults(jsonKey, keyword, res)));
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