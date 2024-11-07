import { SORTBY, DESC } from '../actions/sortby';

const initialState = {
  field: ['relevance'],
  order: [DESC]
};

export default function sortby(state = initialState, action) {
  switch (action.type) {
    case SORTBY:
      return Object.assign({}, state, {
        field: typeof action.field === 'string' ? action.field.split(',') : action.field,
        order: typeof action.order === 'string' ? action.order.split(',') : action.order
      });

    default:
      return state;
  }
}
