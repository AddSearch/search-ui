import {
  KEYWORD
} from '../actions/keyword';

const initialState = {
  value: '',
  skipAutocomplete: false,
  searchFieldContainerId: null,
  setByUrlParam: null
};

export default function keyword(state = initialState, action) {

  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        value: action.value,
        skipAutocomplete: action.skipAutocomplete === true,
        searchFieldContainerId: action.searchFieldContainerId,
        setByUrlParam: action.setByUrlParam
      });

    default:
      return state
  }
}