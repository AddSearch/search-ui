export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SET_RANGE_FILTER = 'SET_RANGE_FILTER';
export const REGISTER_FILTER = 'REGISTER_FILTER';
export const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';
export const SET_ACTIVE_FACETS = 'SET_ACTIVE_FACETS';
export const TOGGLE_FACET_FILTER = 'TOGGLE_FACET_FILTER';
export const CLEAR_SELECTED_FILTERS_AND_FACETS = 'CLEAR_SELECTED_FILTERS_AND_FACETS';

export function registerFilter(filterObj) {
  return {
    type: REGISTER_FILTER,
    filterObj
  }
}

export function toggleFilter(filterName, value, refreshSearch) {
  return {
    type: TOGGLE_FILTER,
    filterName,
    value,
    refreshSearch
  }
}

export function setRangeFilter(field, from, to) {
  return {
    type: SET_RANGE_FILTER,
    field,
    from,
    to
  }
}

export function setActiveFilters(json) {
  return {
    type: SET_ACTIVE_FILTERS,
    json
  }
}

export function setActiveFacets(json) {
  return {
    type: SET_ACTIVE_FACETS,
    json
  }
}

export function toggleFacetFilter(field, value) {
  return {
    type: TOGGLE_FACET_FILTER,
    field,
    value
  }
}

export function clearSelected(refreshSearch) {
  return {
    type: CLEAR_SELECTED_FILTERS_AND_FACETS,
    refreshSearch
  }
}