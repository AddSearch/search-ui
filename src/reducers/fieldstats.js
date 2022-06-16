import { SET_FIELD_STATS } from "../actions/fieldstats";

const initialState = {
  fieldStats: {}
};

export default function fieldstats(state = initialState, action) {
  switch (action.type) {
    case SET_FIELD_STATS:
      return Object.assign({}, state, {
        fieldStats: action.fieldStats
      });

    default:
      return state
  }
}
