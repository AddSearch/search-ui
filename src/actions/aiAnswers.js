import { createAiAnswersData } from '../util/create-ai-answers-data';

export const IS_LOADING_AI_ANSWERS = 'IS_LOADING_AI_ANSWERS';
export const AI_ANSWERS_RESULT = 'AI_ANSWERS_RESULT';
export const AI_ANSWERS_RESULT_ERROR = 'AI_ANSWERS_RESULT_ERROR';
export const SET_AI_ANSWERS_SENTIMENT = 'SET_AI_ANSWERS_SENTIMENT';
export const SET_AI_ANSWERS_ANSWER_EXPANDED = 'SET_AI_ANSWERS_ANSWER_EXPANDED';
export const SET_AI_ANSWERS_HIDDEN = 'SET_AI_ANSWERS_HIDDEN';

export function fetchAiAnswersResultStory(client, keyword) {
  return (dispatch) => {
    dispatch({ type: AI_ANSWERS_RESULT_ERROR, payload: false });
    dispatch({ type: IS_LOADING_AI_ANSWERS, payload: true });

    client.aiAnswers(keyword, (response) => {
      if (response.error) {
        dispatch({ type: AI_ANSWERS_RESULT_ERROR, payload: true });
      } else {
        const aiAnswersResult = createAiAnswersData(response);

        // Re-initialize the sentiment value to neutral if a new answer is generated.
        dispatch({
          type: SET_AI_ANSWERS_SENTIMENT,
          payload: 'neutral'
        });

        dispatch({
          type: AI_ANSWERS_RESULT,
          payload: aiAnswersResult
        });
      }

      dispatch({ type: IS_LOADING_AI_ANSWERS, payload: false });
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
