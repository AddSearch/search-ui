import { createConversationalSearchData } from '../util/create-conversational-search-data';

export const IS_LOADING_CONVERSATIONAL_SEARCH = 'IS_LOADING_CONVERSATIONAL_SEARCH';
export const CONVERSATIONAL_SEARCH_RESULT = 'CONVERSATIONAL_SEARCH_RESULT';

export function fetchConversationalSearchResultStory(client, keyword) {
  return (dispatch) => {
    dispatch({ type: IS_LOADING_CONVERSATIONAL_SEARCH, payload: true });

    client.conversationalSearch(keyword, (response) => {
      const conversationalSearchResult = createConversationalSearchData(response);

      dispatch({
        type: CONVERSATIONAL_SEARCH_RESULT,
        conversationalSearchResult
      });

      dispatch({ type: IS_LOADING_CONVERSATIONAL_SEARCH, payload: false });
    });
  };
}
