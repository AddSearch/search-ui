export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SET_RANGE_FILTER = 'SET_RANGE_FILTER';
export const REGISTER_FILTER = 'REGISTER_FILTER';
export const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';
export const SET_ACTIVE_FACETS = 'SET_ACTIVE_FACETS';
export const SET_ACTIVE_RANGE_FACETS = 'SET_ACTIVE_RANGE_FACETS';
export const TOGGLE_FACET_FILTER = 'TOGGLE_FACET_FILTER';
export const TOGGLE_HIERARCHICAL_FACET_FILTER = 'TOGGLE_HIERARCHICAL_FACET_FILTER';
export const TOGGLE_RANGE_FACET_FILTER = 'TOGGLE_RANGE_FACET_FILTER';
export const CLEAR_SELECTED_FILTERS_AND_FACETS = 'CLEAR_SELECTED_FILTERS_AND_FACETS';
export const CLEAR_SELECTED_RANGE_FACETS = 'CLEAR_SELECTED_RANGE_FACETS';

export function registerFilter(filterObj) {
  return {
    type: REGISTER_FILTER,
    filterObj
  };
}

export function toggleFilter(filterName, value, refreshSearch) {
  return {
    type: TOGGLE_FILTER,
    filterName,
    value,
    refreshSearch
  };
}

export function setRangeFilter(field, from, to) {
  return {
    type: SET_RANGE_FILTER,
    field,
    from,
    to
  };
}

export function setActiveFilters(json) {
  return {
    type: SET_ACTIVE_FILTERS,
    json
  };
}

export function setActiveFacets(json) {
  return {
    type: SET_ACTIVE_FACETS,
    json
  };
}

export function setActiveRangeFacets(json, refreshSearch, field) {
  return {
    type: SET_ACTIVE_RANGE_FACETS,
    json,
    refreshSearch,
    field
  };
}

export function toggleFacetFilter(field, value, refreshSearch) {
  return {
    type: TOGGLE_FACET_FILTER,
    field,
    value,
    refreshSearch
  };
}

export function toggleHierarchicalFacetFilter(field, container, confFields, value, refreshSearch) {
  return {
    type: TOGGLE_HIERARCHICAL_FACET_FILTER,
    field,
    container,
    confFields,
    value,
    refreshSearch
  };
}

export function toggleRangeFacetFilter(field, values, key, refreshSearch, byActiveFilterComponent) {
  return {
    type: TOGGLE_RANGE_FACET_FILTER,
    field,
    values,
    key,
    refreshSearch,
    byActiveFilterComponent
  };
}

export function clearSelectedRangeFacets(refreshSearch, setHistory) {
  return {
    type: CLEAR_SELECTED_RANGE_FACETS,
    refreshSearch,
    setHistory
  };
}

export function clearSelected(refreshSearch, byActiveFilterComponent) {
  return {
    type: CLEAR_SELECTED_FILTERS_AND_FACETS,
    refreshSearch,
    byActiveFilterComponent
  };
}
