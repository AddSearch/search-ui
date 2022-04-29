export const KEYWORD = 'KEYWORD';

export function setKeyword(value, skipAutocomplete, searchFieldContainerId, setByUrlParam) {
  return {
    type: KEYWORD,
    value,
    skipAutocomplete,
    searchFieldContainerId: searchFieldContainerId || null,
    setByUrlParam: setByUrlParam || false
  }
}