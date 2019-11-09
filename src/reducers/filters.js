import {
  SET_CATEGORY_FILTERS,
  ADD_CUSTOM_FIELD_FILTER,
  REMOVE_CUSTOM_FIELD_FILTER
} from '../actions/filters';

const initialState = {
  filters: null,
  customFieldFilters: {}
};

export default function filters(state = initialState, action) {

  switch (action.type) {
    case SET_CATEGORY_FILTERS:
      return Object.assign({}, state, {
        filters: action.filters
      });

    case ADD_CUSTOM_FIELD_FILTER:
      let nexta = Object.assign({}, state.customFieldFilters);
      nexta[action.field] = action.value;

      return Object.assign({}, state, {
        customFieldFilters: nexta
      });

    case REMOVE_CUSTOM_FIELD_FILTER:
      let nextd = Object.assign({}, state.customFieldFilters);
      delete nextd[action.field];

      return Object.assign({}, state, {
        customFieldFilters: nextd
      });



    default:
      return state
  }
}