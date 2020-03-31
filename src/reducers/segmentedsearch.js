import { WARMUP_QUERY_PREFIX } from '../index';
import {
  SEGMENTED_SEARCH_START,
  SEGMENTED_SEARCH_RESULTS
} from '../actions/segmentedsearch';

const initialState = {
  pendingRequests: 0
};

export default function segmentedsearch(state = initialState, action) {
  switch (action.type) {
    case SEGMENTED_SEARCH_START:
      return Object.assign({}, state, {
        pendingRequests: state.pendingRequests + 1
      });

    case SEGMENTED_SEARCH_RESULTS:
      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0) {
        return state;
      }

      const segment = {};
      segment[action.jsonKey] = action.results;
      segment.pendingRequests = state.pendingRequests - 1;
      return Object.assign({}, state, segment);

    default:
      return state;
  }
}