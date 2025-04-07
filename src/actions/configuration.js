export const SET_HAS_AI_ANSWERS = 'SET_HAS_AI_ANSWERS';
export const PAUSE_SEGMENTED_SEARCH = 'PAUSE_SEGMENTED_SEARCH';

export function setHasAiAnswers(hasAiAnswers) {
  return {
    type: SET_HAS_AI_ANSWERS,
    hasAiAnswers
  };
}

export function setPauseSegmentedSearch(pauseSegmentedSearch) {
  return {
    type: PAUSE_SEGMENTED_SEARCH,
    pauseSegmentedSearch
  };
}
