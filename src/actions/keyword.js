export const KEYWORD = 'KEYWORD';
export const KEYWORD_MIN_LENGTH_REQUIRED_TO_FETCH = 'KEYWORD_MIN_LENGTH_REQUIRED_TO_FETCH';

export function setKeyword(value, skipAutocomplete, searchFieldContainerId, setSearchFieldValue) {
  return {
    type: KEYWORD,
    value,
    skipAutocomplete,
    searchFieldContainerId: searchFieldContainerId || null,
    setSearchFieldValue: setSearchFieldValue || false
  };
}

export function setKeywordMinLengthRequiredToFetch(opt) {
  return {
    type: KEYWORD_MIN_LENGTH_REQUIRED_TO_FETCH,
    minLengthRequiredToFetch: opt.minLengthRequiredToFetch
  };
}
