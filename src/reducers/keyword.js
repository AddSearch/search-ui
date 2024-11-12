import { KEYWORD, KEYWORD_MIN_LENGTH_REQUIRED_TO_FETCH } from '../actions/keyword';

const initialState = {
  value: '',
  skipAutocomplete: false,
  searchFieldContainerId: null,
  setSearchFieldValue: null,
  minLengthRequiredToFetch: 0
};

export default function keyword(state = initialState, action) {
  switch (action.type) {
    case KEYWORD:
      return Object.assign({}, state, {
        value: action.value,
        skipAutocomplete: action.skipAutocomplete === true,
        searchFieldContainerId: action.searchFieldContainerId,
        setSearchFieldValue: action.setSearchFieldValue
      });

    case KEYWORD_MIN_LENGTH_REQUIRED_TO_FETCH:
      return Object.assign({}, state, {
        minLengthRequiredToFetch: action.minLengthRequiredToFetch
      });

    default:
      return state;
  }
}
