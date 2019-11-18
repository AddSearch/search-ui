export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const REGISTER_FILTER = 'REGISTER_FILTER';
export const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';
export const SET_ACTIVE_FACETS = 'SET_ACTIVE_FACETS';
export const TOGGLE_FACET_FILTER = 'TOGGLE_FACET_FILTER';

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
