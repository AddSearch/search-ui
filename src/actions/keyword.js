export const KEYWORD = 'KEYWORD';

export function setKeyword(value, externallySet) {
  return { type: KEYWORD, value, externallySet }
}