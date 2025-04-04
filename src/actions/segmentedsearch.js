import { sendSearchStats } from '../util/analytics';
import { WARMUP_QUERY_PREFIX } from '../index';

export const SEGMENTED_SEARCH_START = 'SEGMENTED_SEARCH_START';
export const SEGMENTED_SEARCH_RESULTS = 'SEGMENTED_SEARCH_RESULTS';
export const CLEAR_SEGMENTED_SEARCH_RESULTS = 'CLEAR_SEGMENTED_SEARCH_RESULTS';

export function segmentedSearch(client, jsonKey, keyword) {
  // Clear search results if there is no keyword
  if (!keyword || keyword === '') {
    return {
      type: CLEAR_SEGMENTED_SEARCH_RESULTS
    };
  }

  return (dispatch) => {
    dispatch(segmentedSearchStart(jsonKey));
    client.search(keyword, (res) => {
      if (keyword.indexOf(WARMUP_QUERY_PREFIX) === -1) {
        return dispatch(segmentedSearchResults(jsonKey, keyword, res, client));
      }
    });
  };
}

export function segmentedSearchStart(jsonKey) {
  return {
    type: SEGMENTED_SEARCH_START,
    jsonKey
  };
}

export function segmentedSearchResults(jsonKey, keyword, results, client) {
  sendSearchStats(client, keyword, results.total_hits, results.processing_time_ms);
  return {
    type: SEGMENTED_SEARCH_RESULTS,
    jsonKey,
    keyword,
    results
  };
}
