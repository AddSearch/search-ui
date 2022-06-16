export const SET_FIELD_STATS = 'SET_FIELD_STATS';

export function setFieldStats(json) {
  return {
    type: SET_FIELD_STATS,
    fieldStats: json
  }
}