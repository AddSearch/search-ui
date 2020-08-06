import { WARMUP_QUERY_PREFIX } from '../index';
import {
  SEGMENTED_SEARCH_START,
  SEGMENTED_SEARCH_RESULTS,
  CLEAR_SEGMENTED_SEARCH_RESULTS
} from '../actions/segmentedsearch';

const initialState = {
  pendingSegments: []
};

export default function segmentedsearch(state = initialState, action) {
  switch (action.type) {
    case SEGMENTED_SEARCH_START:
      let addPendingSegments = [...state.pendingSegments];
      if (addPendingSegments.indexOf(action.jsonKey) === -1) {
        addPendingSegments.push(action.jsonKey);
      }
      return Object.assign({}, state, {
        pendingSegments: addPendingSegments,
        dropReturningResults: false
      });


    case SEGMENTED_SEARCH_RESULTS:
      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0 || state.dropReturningResults === true) {
        return state;
      }

      // Incoming segment
      const segment = {};
      segment[action.jsonKey] = action.results;

      // Update list of pending segment requests
      let removePendingSegments = [...state.pendingSegments];
      if (removePendingSegments.indexOf(action.jsonKey) !== -1) {
        removePendingSegments.splice(removePendingSegments.indexOf(action.jsonKey), 1);
      }

      return Object.assign({}, state, segment, {
        pendingSegments: removePendingSegments
      });

    case CLEAR_SEGMENTED_SEARCH_RESULTS:
      return Object.assign({}, {
        pendingSegments: [],
        dropReturningResults: true // Don't render pending results returning after clear
      });

    default:
      return state;
  }
}