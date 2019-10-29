import {
  KEYWORD
} from '../actions/keyword';

const initialState = {
  value: '',
  externallySet: false
};

export default function keyword(state = initialState, action) {

  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        value: action.value,
        externallySet: action.externallySet === true
      });

    default:
      return state
  }
}