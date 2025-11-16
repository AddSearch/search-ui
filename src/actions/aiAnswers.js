import { createAiAnswersData } from '../util/create-ai-answers-data';

export const IS_LOADING_AI_ANSWERS = 'IS_LOADING_AI_ANSWERS';
export const AI_ANSWERS_RESULT = 'AI_ANSWERS_RESULT';
export const AI_ANSWERS_RESULT_ERROR = 'AI_ANSWERS_RESULT_ERROR';
export const SET_AI_ANSWERS_SENTIMENT = 'SET_AI_ANSWERS_SENTIMENT';
export const SET_AI_ANSWERS_ANSWER_EXPANDED = 'SET_AI_ANSWERS_ANSWER_EXPANDED';
export const SET_AI_ANSWERS_HIDDEN = 'SET_AI_ANSWERS_HIDDEN';
export const CLEAR_AI_ANSWERS_RESULT = 'CLEAR_AI_ANSWERS_RESULT';
export const SET_CURRENT_AI_REQUEST_ID = 'SET_CURRENT_AI_REQUEST_ID';

// Track current request ID to ignore callbacks from old requests
let currentRequestId = 0;

export function fetchAiAnswersResultStory(client, keyword) {
  return (dispatch, getState) => {
    // Increment request ID for this new request
    const requestId = ++currentRequestId;

    dispatch({ type: AI_ANSWERS_RESULT_ERROR, payload: false });
    dispatch({ type: IS_LOADING_AI_ANSWERS, payload: true });
    dispatch({ type: CLEAR_AI_ANSWERS_RESULT });
    dispatch({ type: SET_CURRENT_AI_REQUEST_ID, payload: requestId });

    // Track if this is the first chunk to avoid dispatching loading=false multiple times
    let isFirstChunk = true;

    client.aiAnswers(keyword, (response) => {
      const state = getState();

      if (state.search.currentAiAnswersRequestId !== requestId) {
        return;
      }

      if (response.is_streaming_complete === undefined || (isFirstChunk && response.answer?.trim())) {
        dispatch({ type: IS_LOADING_AI_ANSWERS, payload: false });
        isFirstChunk = false;
      }

      if (response.error) {
        dispatch({ type: AI_ANSWERS_RESULT_ERROR, payload: true });
      } else {
        const aiAnswersResult = createAiAnswersData(response);
        if (!state.search.aiAnswersResult.id) {
          dispatch({
            type: SET_AI_ANSWERS_SENTIMENT,
            payload: 'neutral'
          });
        }

        dispatch({
          type: AI_ANSWERS_RESULT,
          payload: aiAnswersResult
        });
      }
    });
  };
}

export function putSentimentValueStory(client, conversationId, sentimentValue) {
  return (dispatch) => {
    // Assuming here that we can live with the optimistic update here.
    dispatch({
      type: SET_AI_ANSWERS_SENTIMENT,
      payload: sentimentValue
    });

    client
      .putSentimentClick(conversationId, sentimentValue)
      .then() // No need to do anything here, client js lib will handle errors. And we are not working with the response data.
      .catch((error) => {
        console.error(error);
      });
  };
}
