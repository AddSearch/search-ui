import {
  TOGGLE_FILTER,
  SET_RANGE_FILTER,
  REGISTER_FILTER,
  SET_ACTIVE_FILTERS,
  SET_ACTIVE_FACETS,
  TOGGLE_FACET_FILTER,
  CLEAR_SELECTED_FILTERS_AND_FACETS
} from '../actions/filters';
import { FILTER_TYPE } from '../components/filters';

const initialState = {
  allAvailableFilters: [],
  activeFilters: {},
  activeFacets: {},
  activeRangeFilters: {},
  refreshSearch: true
};

export default function filters(state = initialState, action) {

  switch (action.type) {
    case REGISTER_FILTER:
      let nextAllAvailableFilters = state.allAvailableFilters.slice();

      // Range filter. Construct object
      if (action.filterObj.type === FILTER_TYPE.RANGE) {
        let range = {};
        range[action.filterObj.field] = {label: action.filterObj.name}
        nextAllAvailableFilters.push(range);
      }
      // Other filters
      else if (action.filterObj.options) {
        const options = Object.assign({}, action.filterObj.options);
        nextAllAvailableFilters.push(options);
      }
      return Object.assign({}, state, {
        allAvailableFilters: nextAllAvailableFilters
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
        refreshSearch: action.refreshSearch === false ? false : true
      });


    case SET_RANGE_FILTER:
      let nextActiveRanges = Object.assign({}, state.activeRangeFilters);
      nextActiveRanges[action.field] = {};
      if (action.from !== null) {
        nextActiveRanges[action.field].gte = action.from;
      }
      if (action.to !== null) {
        nextActiveRanges[action.field].lte = action.to;
      }
      if (action.from === null && action.to === null) {
        delete nextActiveRanges[action.field];
      }
      return Object.assign({}, state, {
        activeRangeFilters: nextActiveRanges,
        refreshSearch: true
      });



    case CLEAR_SELECTED_FILTERS_AND_FACETS:
      return Object.assign({}, state, {
        activeFacets: {},
        activeFilters: {},
        activeRangeFilters: {},
        refreshSearch: action.refreshSearch === false ? false : true
      });


    case SET_ACTIVE_FILTERS:
      return Object.assign({}, state, {
        activeFilters: action.json || {},
        refreshSearch: false
      });


    case SET_ACTIVE_FACETS:
      return Object.assign({}, state, {
        activeFacets: action.json || {},
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