import { SET_PAGE } from '../actions/pagination';

const initialState = {
  page: 1
};

export default function pagination(state = initialState, action) {
  switch (action.type) {
    case SET_PAGE:
      return Object.assign({}, state, {
        page: action.page
      });

    default:
      return state;
  }
}
