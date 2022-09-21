import {
  TOGGLE_FILTER,
  SET_RANGE_FILTER,
  REGISTER_FILTER,
  SET_ACTIVE_FILTERS,
  SET_ACTIVE_FACETS,
  SET_ACTIVE_RANGE_FACETS,
  TOGGLE_FACET_FILTER,
  TOGGLE_RANGE_FACET_FILTER,
  CLEAR_SELECTED_FILTERS_AND_FACETS, TOGGLE_HIERARCHICAL_FACET_FILTER, CLEAR_SELECTED_RANGE_FACETS
} from '../actions/filters';
import { FILTER_TYPE } from '../components/filters';

const initialState = {
  allAvailableFilters: [],
  activeFilters: {},
  activeFacets: {},
  activeRangeFacets: {},
  activeHierarchicalFacets: {},
  indeterminateHierarchicalFacets: [],
  openedHierarchicalFacetGroups: [],
  activeRangeFilters: {},
  refreshSearch: true
};

const hasActiveSelection = function(activeGroups, parentFacet) {

  return Object.keys(activeGroups).filter(function(key) {
    return key.indexOf(parentFacet + ' >') > -1;
  }).length > 0;
}

const updateHierarchicalFacetState = function(activeHierarchicalFacetState, indeterminateHierarchicalFacets, action) {

  if (!activeHierarchicalFacetState[action.container]) {
    activeHierarchicalFacetState[action.container] = {};
  }

  if (!activeHierarchicalFacetState[action.container][action.field]) {
    activeHierarchicalFacetState[action.container][action.field] = {};
  }

  // Remove filter
  if (activeHierarchicalFacetState[action.container][action.field][action.value]) {
    const lastSeparatorPos = action.value.lastIndexOf('>');
    const parentFacetValue = lastSeparatorPos > -1 ? action.value.slice(0, lastSeparatorPos - 1) : null;

    delete activeHierarchicalFacetState[action.container][action.field][action.value];
    if (parentFacetValue && !hasActiveSelection(activeHierarchicalFacetState[action.container][action.field], parentFacetValue)) {
      const j = indeterminateHierarchicalFacets.indexOf(parentFacetValue);
      if (j > -1) {
        indeterminateHierarchicalFacets.splice(j, 1);
      }
    }
  }
  // Add filter
  else {
    activeHierarchicalFacetState[action.container][action.field][action.value] = 'true';

    // Remove all related facets in the below level
    for (let level in activeHierarchicalFacetState[action.container]) {
      for (let activeFacetGroup in activeHierarchicalFacetState[action.container][level]) {
        if (activeFacetGroup.indexOf(action.value + ' >') === 0) {
          delete activeHierarchicalFacetState[action.container][level][activeFacetGroup];
        }
      }
    }
    indeterminateHierarchicalFacets = indeterminateHierarchicalFacets.filter(facet => facet.indexOf(action.value + ' > ') !== 0);

    // Remove all relating parent facets
    const removingFacetList = action.value.split(' > ').reduce((prev, curr) => {
      const l = prev[prev.length - 1];
      const f = l ? l + ' > ' + curr : curr;
      if (f !== action.value) {
        prev.push(f)
      }
      return prev;
    }, []);

    for (let level in activeHierarchicalFacetState[action.container]) {
      for (let activeFacetGroup in activeHierarchicalFacetState[action.container][level]) {
        if (removingFacetList.indexOf(activeFacetGroup) !== -1) {
          delete activeHierarchicalFacetState[action.container][level][activeFacetGroup];
        }
      }
    }

    indeterminateHierarchicalFacets = indeterminateHierarchicalFacets
      .filter(f => removingFacetList.indexOf(f) === -1)
      .concat(removingFacetList);
  }

  // Remove indeterminate facet
  const j = indeterminateHierarchicalFacets.indexOf(action.value);
  if (j > -1) {
    indeterminateHierarchicalFacets.splice(j, 1);
  }

  return {
    activeHierarchicalFacetState,
    indeterminateHierarchicalFacets
  };
};

export default function filters(state = initialState, action) {

  switch (action.type) {
    case REGISTER_FILTER:
      let nextAllAvailableFilters = state.allAvailableFilters.slice();

      // Range filter. Construct object. Use labelShort if available
      if (action.filterObj.type === FILTER_TYPE.RANGE) {
        let range = {};
        range[action.filterObj.field] = {
          label: action.filterObj.labelShort ? action.filterObj.labelShort : action.filterObj.label
        };
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
        refreshSearch: action.refreshSearch === false ? false : true,
        targetFacetGroup: null
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
        activeHierarchicalFacets: {},
        indeterminateHierarchicalFacets: [],
        activeRangeFilters: {},
        activeRangeFacets: {},
        refreshSearch: action.refreshSearch === false ? false : true,
        targetFacetGroup: action.byActiveFilterComponent ? 'component.activeFilters' : null
      });


    case CLEAR_SELECTED_RANGE_FACETS:
      return Object.assign({}, state, {
        activeRangeFacets: {},
        refreshSearch: action.refreshSearch === false ? false : true,
        setHistory: action.setHistory
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

    case SET_ACTIVE_RANGE_FACETS:
      return Object.assign({}, state, {
        activeRangeFacets: action.json || {},
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
        refreshSearch: action.refreshSearch === false ? false : true,
        targetFacetGroup: action.field
      });


    case TOGGLE_HIERARCHICAL_FACET_FILTER:
      let nextActiveHierarchicalFacets = Object.assign({}, state.activeHierarchicalFacets);
      let nextIndeterminateHierarchicalFacets = state.indeterminateHierarchicalFacets.slice();
      const newFacetStates = updateHierarchicalFacetState(nextActiveHierarchicalFacets, nextIndeterminateHierarchicalFacets, action);

      nextActiveHierarchicalFacets = newFacetStates.activeHierarchicalFacetState;
      nextIndeterminateHierarchicalFacets = newFacetStates.indeterminateHierarchicalFacets;
      nextActiveHierarchicalFacets['v'] = !nextActiveHierarchicalFacets['v'] ? 1 : nextActiveHierarchicalFacets['v']+1;

      return Object.assign({}, state, {
        activeHierarchicalFacets: nextActiveHierarchicalFacets,
        indeterminateHierarchicalFacets: nextIndeterminateHierarchicalFacets,
        refreshSearch: action.refreshSearch === false ? false : true,
        targetFacetGroup: action.field
      });

    case TOGGLE_RANGE_FACET_FILTER:
      let nextActiveRangeFacets = Object.assign({}, state.activeRangeFacets);

      if (!nextActiveRangeFacets[action.field]) {
        nextActiveRangeFacets[action.field] = {};
      }

      // Remove range facet
      if (nextActiveRangeFacets[action.field][action.key]) {
        delete nextActiveRangeFacets[action.field][action.key];
      }
      // Add range facet
      else {
        nextActiveRangeFacets[action.field][action.key] = {
          gte: action.values.min,
          lt: action.values.max
        };
      }
      nextActiveRangeFacets['v'] = !nextActiveRangeFacets['v'] ? 1 : nextActiveRangeFacets['v']+1;

      return Object.assign({}, state, {
        activeRangeFacets: nextActiveRangeFacets,
        refreshSearch: action.refreshSearch === false ? false : true,
        targetFacetGroup: action.byActiveFilterComponent ? 'component.activeFilters' : action.field
      });


    default:
      return state
  }
}