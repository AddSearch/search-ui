export const KEYWORD = 'KEYWORD';

export function setKeyword(value, skipAutocomplete, searchFieldContainerId) {
  return {
    type: KEYWORD,
      value,
      skipAutocomplete,
      searchFieldContainerId: searchFieldContainerId || null
  }
}