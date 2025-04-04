import { SET_HAS_AI_ANSWERS } from '../actions/configuration';

export const initialConfigurationState = {
  searchPersistence: 'url'
};

export default function configuration(state = initialConfigurationState, action) {
  switch (action.type) {
    case SET_HAS_AI_ANSWERS:
      return {
        ...state,
        hasAiAnswers: action.hasAiAnswers
      };

    default:
      return state;
  }
}
