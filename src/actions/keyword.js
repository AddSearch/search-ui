export const KEYWORD = 'KEYWORD';

export function setKeyword(value, skipAutocomplete, searchFieldContainerId, setSearchFieldValue) {
  return {
    type: KEYWORD,
    value,
    skipAutocomplete,
    searchFieldContainerId: searchFieldContainerId || null,
    setSearchFieldValue: setSearchFieldValue || false
  }
}