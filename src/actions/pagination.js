import {setHistory, HISTORY_PARAMETERS} from '../util/history';

export const SET_PAGE = 'SET_PAGE';

export function setPage(client, page, updateBrowserHistory, store) {
  if (updateBrowserHistory !== false &&
    (client.getSettings().paging.page !== page || page === 1)) {
    setHistory(HISTORY_PARAMETERS.PAGE, page + '', null, store);
  }

  const paging = client.getSettings().paging;
  client.setPaging(page, paging.pageSize, paging.sortBy, paging.sortOrder);

  return {
    type: SET_PAGE,
    page
  }
}
