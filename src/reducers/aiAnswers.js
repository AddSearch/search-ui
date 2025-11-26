import {
  IS_LOADING_AI_ANSWERS,
  AI_ANSWERS_RESULT,
  AI_ANSWERS_RESULT_ERROR,
  SET_AI_ANSWERS_SENTIMENT,
  SET_AI_ANSWERS_ANSWER_EXPANDED,
  SET_AI_ANSWERS_HIDDEN,
  CLEAR_AI_ANSWERS_RESULT,
  SET_CURRENT_AI_REQUEST_ID
} from '../actions/aiAnswers';

// Note: Currently uses shared keyword.value from keyword reducer
// Future: May add separate 'question' state for conversational AI features

const initialState = {
  result: {
    id: null,
    answerText: '',
    sources: [],
    isStreaming: false
  },
  loading: false,
  error: false,
  sentiment: 'neutral',
  answerExpanded: false,
  hidden: false,
  currentRequestId: null
};

export default function aiAnswers(state = initialState, action) {
  switch (action.type) {
    case IS_LOADING_AI_ANSWERS:
      return {
        ...state,
        loading: action.payload
      };

    case AI_ANSWERS_RESULT:
      return {
        ...state,
        result: action.payload
      };

    case CLEAR_AI_ANSWERS_RESULT:
      return {
        ...state,
        result: {
          id: null,
          answerText: '',
          sources: [],
          isStreaming: false
        }
      };

    case SET_CURRENT_AI_REQUEST_ID:
      return {
        ...state,
        currentRequestId: action.payload
      };

    case AI_ANSWERS_RESULT_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case SET_AI_ANSWERS_SENTIMENT:
      return {
        ...state,
        sentiment: action.payload
      };

    case SET_AI_ANSWERS_ANSWER_EXPANDED:
      return {
        ...state,
        answerExpanded: action.payload
      };

    case SET_AI_ANSWERS_HIDDEN:
      return {
        ...state,
        hidden: action.payload
      };

    default:
      return state;
  }
}
