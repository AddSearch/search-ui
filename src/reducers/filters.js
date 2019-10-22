import {
  SET_FILTERS
} from '../actions/filters';

const initialState = {
  filters: null
};

export default function filters(state = initialState, action) {

  switch (action.type) {
    case SET_FILTERS:
      return Object.assign({}, state, {
        filters: action.filters
      });

    default:
      return state
  }
}