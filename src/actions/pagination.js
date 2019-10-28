import { setHistory, HISTORY_PARAMETERS } from '../util/history';

export const SET_PAGE = 'SET_PAGE';

export function setPage(client, page) {
  setHistory(HISTORY_PARAMETERS.PAGE, page + '');
  client.setPaging(page, 10, 'relevance', 'desc');

  return {
    type: SET_PAGE,
    page
  }
}