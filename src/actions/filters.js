import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SET_FILTERS = 'ADD_FILTER';

export function setFilters(client, filters) {
  setHistory(HISTORY_PARAMETERS.FILTERS, filters);
  client.setCategoryFilters(filters);

  return {
    type: SET_FILTERS,
    filters,
    client
  }
}