import { createConversationalSearchData } from '../util/create-conversational-search-data';

export const IS_LOADING_CONVERSATIONAL_SEARCH = 'IS_LOADING_CONVERSATIONAL_SEARCH';
export const CONVERSATIONAL_SEARCH_RESULT = 'CONVERSATIONAL_SEARCH_RESULT';
export const CONVERSATIONAL_SEARCH_RESULT_ERROR = 'CONVERSATIONAL_SEARCH_RESULT_ERROR';
export const SET_CONVERSATIONAL_SEARCH_SENTIMENT = 'SET_CONVERSATIONAL_SEARCH_SENTIMENT';
export const SET_CONVERSATIONAL_SEARCH_ANSWER_EXPANDED =
  'SET_CONVERSATIONAL_SEARCH_ANSWER_EXPANDED';

export function fetchConversationalSearchResultStory(client, keyword) {
  return (dispatch) => {
    dispatch({ type: CONVERSATIONAL_SEARCH_RESULT_ERROR, payload: false });
    dispatch({ type: IS_LOADING_CONVERSATIONAL_SEARCH, payload: true });

    client.conversationalSearch(keyword, (response) => {
      if (response.error) {
        dispatch({ type: CONVERSATIONAL_SEARCH_RESULT_ERROR, payload: true });
      } else {
        const conversationalSearchResult = createConversationalSearchData(response);

        dispatch({
          type: CONVERSATIONAL_SEARCH_RESULT,
          payload: conversationalSearchResult
        });
      }

      dispatch({ type: IS_LOADING_CONVERSATIONAL_SEARCH, payload: false });
    });
  };
}

export function putSentimentValueStory(client, conversationId, sentimentValue) {
  return (dispatch) => {
    // Assuming here that we can live with the optimistic update here.
    dispatch({
      type: SET_CONVERSATIONAL_SEARCH_SENTIMENT,
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
