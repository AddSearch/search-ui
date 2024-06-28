export const KEYWORD = 'KEYWORD';
export const QUESTION = 'QUESTION';

export function setKeyword(value, skipAutocomplete, searchFieldContainerId, setSearchFieldValue) {
  return {
    type: KEYWORD,
    value,
    skipAutocomplete,
    searchFieldContainerId: searchFieldContainerId || null,
    setSearchFieldValue: setSearchFieldValue || false
  }
}

// export function setQuestion(value) {
//   return {
//     type: QUESTION,
//     value
//   }
// }
