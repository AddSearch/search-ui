export const SORTBY = 'SORTBY';
export const DESC = 'desc';

export function sortBy(client, field, order) {
  const paging = client.getSettings().paging;
  client.setPaging(1, paging.pageSize, field, order);
  console.log('SORT BY set ' + field + ' ' + order);

  return {
    type: SORTBY,
    field,
    order
  };
}