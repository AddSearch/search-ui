import {
  KEYWORD
} from '../actions/keyword';

const initialState = {
  value: '',
  skipAutocomplete: false
};

export default function keyword(state = initialState, action) {

  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        value: action.value,
        skipAutocomplete: action.skipAutocomplete === true
      });

    default:
      return state
  }
}