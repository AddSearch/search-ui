export const KEYWORD = 'KEYWORD';

export function setKeyword(value, skipAutocomplete) {
  return { type: KEYWORD, value, skipAutocomplete }
}