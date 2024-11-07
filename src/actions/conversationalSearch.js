import { createConversationalSearchData } from '../util/create-conversational-search-data';

export const CONVERSATIONAL_SEARCH_FETCH_START = 'CONVERSATIONAL_SEARCH_FETCH_START';
export const CONVERSATIONAL_SEARCH_RESULT = 'CONVERSATIONAL_SEARCH_RESULT';

export function fetchConversationalSearchResultStory(client, keyword) {
  return (dispatch) => {
    dispatch({ type: CONVERSATIONAL_SEARCH_FETCH_START });

    client.conversationalSearch(keyword, (response) => {
      const conversationalSearchResult = createConversationalSearchData(response);

      dispatch({
        type: CONVERSATIONAL_SEARCH_RESULT,
        conversationalSearchResult
      });
    });
  };
}
