import {
  TOGGLE_FILTER,
  REGISTER_FILTER,
  SET_ACTIVE_FILTERS,
  TOGGLE_FACET_FILTER
} from '../actions/filters';

const initialState = {
  availableFilters: [],
  activeFilters: {},
  activeFacets: {},
  refreshSearch: true
};

export default function filters(state = initialState, action) {

  switch (action.type) {
    case REGISTER_FILTER:
      let nextAvailable = state.availableFilters.slice();
      nextAvailable.push(action.filterObj);

      return Object.assign({}, state, {
        availableFilters: nextAvailable
      });


    case TOGGLE_FILTER:
      let nextActive = Object.assign({}, state.activeFilters);

      // Remove filter
      if (nextActive[action.filterName]) {
        delete nextActive[action.filterName];
      }
      // Add filter
      else {
        nextActive[action.filterName] = action.value;
      }

      return Object.assign({}, state, {
        activeFilters: nextActive,
        refreshSearch: true
      });


    case SET_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.json || {},
        refreshSearch: false
      });


    case TOGGLE_FACET_FILTER:
      let nextActiveFacets = Object.assign({}, state.activeFacets);

      if (!nextActiveFacets[action.field]) {
        nextActiveFacets[action.field] = {};
      }

      // Remove filter
      if (nextActiveFacets[action.field][action.value]) {
        delete nextActiveFacets[action.field][action.value];
      }
      // Add filter
      else {
        nextActiveFacets[action.field][action.value] = 'true';
      }
      nextActiveFacets['v'] = !nextActiveFacets['v'] ? 1 : nextActiveFacets['v']+1;

      return Object.assign({}, state, {
        activeFacets: nextActiveFacets,
        refreshSearch: true
      });


    default:
      return state
  }
}