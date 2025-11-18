import { WARMUP_QUERY_PREFIX } from '../index';
import {
  START,
  SEARCH_FETCH_START,
  SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_RESULTS_PAGE_URL
} from '../actions/search';
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

const initialState = {
  started: false,
  keyword: null,
  results: {},
  loading: false,
  aiAnswersResult: {},
  loadingAiAnswersResult: false,
  aiAnswersResultError: false,
  aiAnswerSentiment: 'neutral',
  isAiAnswersAnswerExpanded: false,
  isAiAnswersHidden: false,
  searchResultsPageUrl: null, // Redir to a search page instead of executing API call
  currentAiAnswersRequestId: null // Track current request to ignore old callbacks
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case START:
      return Object.assign({}, state, {
        started: true
      });

    case CLEAR_SEARCH_RESULTS:
      return Object.assign({}, state, {
        keyword: null,
        results: {},
        loading: false,
        aiAnswersResult: {},
        aiAnswersResultError: false,
        loadingAiAnswersResult: false,
        aiAnswersSentiment: 'neutral',
        dropReturningResults: true, // Don't render pending results returning after clear
        currentAiAnswersRequestId: null
      });

    case SEARCH_FETCH_START:
      return Object.assign({}, state, {
        loading: true,
        dropReturningResults: false
      });

    case SEARCH_RESULTS:
      if (!state.started) {
        console.log('WARNING: AddSearch UI not started with the start() function');
      }

      if (state.dropReturningResults === true) {
        return state;
      }

      if (action.keyword.indexOf(WARMUP_QUERY_PREFIX) === 0) {
        return Object.assign({}, state, {
          loading: false
        });
      }

      let nextResults = action.results;

      // If append mode (e.g. infinite scroll) keep old hits as well
      if (action.appendResults === true && state.results.hits) {
        const allHits = [...state.results.hits, ...action.results.hits];
        nextResults.hits = allHits;
      }

      return Object.assign({}, state, {
        keyword: action.keyword,
        results: nextResults,
        loading: false,
        callBy: action.requestBy
      });

    case IS_LOADING_AI_ANSWERS:
      return Object.assign({}, state, {
        loadingAiAnswersResult: action.payload
      });

    case AI_ANSWERS_RESULT:
      return Object.assign({}, state, {
        aiAnswersResult: action.payload
      });

    case CLEAR_AI_ANSWERS_RESULT:
      return {
        ...state,
        aiAnswersResult: {
          id: null,
          answerText: '',
          sources: [],
          isStreaming: false
        }
      };

    case SET_CURRENT_AI_REQUEST_ID:
      return {
        ...state,
        currentAiAnswersRequestId: action.payload
      };

    case AI_ANSWERS_RESULT_ERROR:
      return Object.assign({}, state, {
        aiAnswersResultError: action.payload
      });

    case SET_AI_ANSWERS_SENTIMENT:
      return Object.assign({}, state, {
        aiAnswersSentiment: action.payload
      });

    case SET_AI_ANSWERS_ANSWER_EXPANDED:
      return Object.assign({}, state, {
        isAiAnswersAnswerExpanded: action.payload
      });

    case SET_AI_ANSWERS_HIDDEN:
      return Object.assign({}, state, {
        isAiAnswersHidden: action.payload
      });

    case SET_SEARCH_RESULTS_PAGE_URL:
      return Object.assign({}, state, {
        searchResultsPageUrl: action.url
      });

    default:
      return state;
  }
}
