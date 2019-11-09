import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SET_CATEGORY_FILTERS = 'SET_CATEGORY_FILTERS';
export const ADD_CUSTOM_FIELD_FILTER = 'ADD_CUSTOM_FIELD_FILTER';
export const REMOVE_CUSTOM_FIELD_FILTER = 'REMOVE_CUSTOM_FIELD_FILTER';

export function setCategoryFilters(client, filters) {
  setHistory(HISTORY_PARAMETERS.FILTERS, filters);
  client.setCategoryFilters(filters);

  return {
    type: SET_CATEGORY_FILTERS,
    filters
  }
}

export function addCustomFieldFilter(client, field, value) {
  client.addCustomFieldFilter(field, value);

  return {
    type: ADD_CUSTOM_FIELD_FILTER,
    field,
    value
  }
}

export function removeCustomFieldFilter(client, field, value) {
  if (value) {
    client.addCustomFieldFilter(field, value);
  }
  else {
    client.removeCustomFieldFilter(field);
  }

  return {
    type: REMOVE_CUSTOM_FIELD_FILTER,
    field,
    value: value || null
  }
}