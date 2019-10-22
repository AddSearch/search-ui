export const SET_FILTERS = 'ADD_FILTER';


export function setFilters(client, filters) {
  client.setCategoryFilters(filters);
  return {
    type: SET_FILTERS,
    filters
  }
}