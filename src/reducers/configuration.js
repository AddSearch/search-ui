import { PAUSE_SEGMENTED_SEARCH, SET_HAS_AI_ANSWERS } from '../actions/configuration';

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

    case PAUSE_SEGMENTED_SEARCH:
      return {
        ...state,
        pauseSegmentedSearch: action.pauseSegmentedSearch
      };

    default:
      return state;
  }
}
