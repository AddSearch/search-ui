import {
  SORTBY, DESC
} from '../actions/sortby';

const initialState = {
  field: 'relevance',
  order: DESC
};

export default function sortby(state = initialState, action) {

  switch (action.type) {
    case SORTBY:
      return Object.assign({}, state, {
        field: action.field,
        order: action.order
      });

    default:
      return state
  }
}