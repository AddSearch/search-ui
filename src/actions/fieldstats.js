export const SET_FIELD_STATS = 'SET_FIELD_STATS';
export const CLEAR_FIELD_STATS = 'CLEAR_FIELD_STATS';

export function setFieldStats(json, callBy) {
  return {
    type: SET_FIELD_STATS,
    fieldStats: json,
    callBy
  };
}

export function clearFieldStats() {
  return {
    type: CLEAR_FIELD_STATS
  };
}
