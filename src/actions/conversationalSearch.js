import { createConversationalSearchData } from '../util/create-conversational-search-data';

export const IS_LOADING_CONVERSATIONAL_SEARCH = 'IS_LOADING_CONVERSATIONAL_SEARCH';
export const CONVERSATIONAL_SEARCH_RESULT = 'CONVERSATIONAL_SEARCH_RESULT';
export const CONVERSATIONAL_SEARCH_RESULT_ERROR = 'CONVERSATIONAL_SEARCH_RESULT_ERROR';

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
