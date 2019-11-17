export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const REGISTER_FILTER = 'REGISTER_FILTER';
export const SET_ACTIVE_FILTERS = 'SET_ACTIVE_FILTERS';

export function registerFilter(filterObj) {
  return {
    type: REGISTER_FILTER,
    filterObj
  }
}

export function toggleFilter(filterName, value) {
  return {
    type: TOGGLE_FILTER,
    filterName,
    value
  }
}

export function setActiveFilters(json) {
  return {
    type: SET_ACTIVE_FILTERS,
    json
  }
}