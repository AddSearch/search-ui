import { WARMUP_QUERY_PREFIX } from '../index';
import {
  SEGMENTED_SEARCH_RESULTS
} from '../actions/segmentedsearch';

const initialState = {};

export default function segmentedsearch(state = initialState, action) {
  switch (action.type) {
    case SEGMENTED_SEARCH_RESULTS:
      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0) {
        return state;
      }

      const segment = {};
      segment[action.jsonKey] = action.results;
      return Object.assign({}, state, segment);

    default:
      return state;
  }
}