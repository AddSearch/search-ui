export const SET_HAS_AI_ANSWERS = 'SET_HAS_AI_ANSWERS';

export function setHasAiAnswers(hasAiAnswers) {
  return {
    type: SET_HAS_AI_ANSWERS,
    hasAiAnswers
  };
}
