export const SORTBY = 'SORTBY';
export const DESC = 'desc';
import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export function sortBy(client, field, order, store) {
  if (store) {
    setHistory(HISTORY_PARAMETERS.SORTBY, JSON.stringify({field: field, order: order}), null, store);
  }
  const paging = client.getSettings().paging;
  client.setPaging(paging.page, paging.pageSize, field, order);

  return {
    type: SORTBY,
    field,
    order
  };
}