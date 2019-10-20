import {
  KEYWORD
} from '../actions/keyword';

const initialState = {
  value: ''
};

export default function keyword(state = initialState, action) {

  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        value: action.value
      });

    default:
      return state
  }
}