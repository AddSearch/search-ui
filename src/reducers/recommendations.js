import {
  CLEAR_RECOMMENDATION,
  FETCH_RECO_FBT, FETCH_RELATED_ITEMS
} from '../actions/recommendations';

const initialState = {
  container: null,
  recommendType: null,
  results: null
};

export default function recommendation(state = initialState, action) {
  switch (action.type) {

    case FETCH_RECO_FBT:
      return Object.assign({}, state, {
        container: action.container,
        recommendType: action.recommendType,
        results: action.results
      });

    case FETCH_RELATED_ITEMS:
      return Object.assign({}, state, {
        container: action.container,
        recommendType: action.recommendType,
        results: action.results
      });

    case CLEAR_RECOMMENDATION:
      return Object.assign({}, initialState);

    default:
      return state;
  }
}
