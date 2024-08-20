export const SET_GENERATED_ANSWER = 'SET_GENERATED_ANSWER';
export const SET_QUESTION = 'SET_QUESTION';

export function askQuestion(client, question, store) {

  // // Clear search results if there is no keyword
  // if (!keyword || keyword === '') {
  //   return {
  //     type: CLEAR_SEARCH_RESULTS
  //   }
  // }
  return dispatch => {
    client.generateAnswer(question, (res) => {
      dispatch(setGeneratedAnswer(question, res));
    });
    // dispatch(searchFetchStart());
    // client.search(keyword, (res) => {
    //   if ((fieldForInstantRedirectGlobal || fieldForInstantRedirect) && res && res.hits && res.hits.length) {
    //     var field = fieldForInstantRedirectGlobal || fieldForInstantRedirect;
    //     var customFieldName = field.replace('custom_fields.', '');
    //     var matchedHit = _matchKeywordToCustomFieldValue(keyword, res.hits, customFieldName);
    //
    //     if (matchedHit && !isHistoryDebounced) {
    //       window.location.replace(matchedHit.url);
    //       return;
    //     }
    //   }
    //   dispatch(searchResults(client, keyword, res, onResultsScrollTo, appendResults, requestBy));
    // });
  }
}

export function setQuestion(value) {
  return {
    type: SET_QUESTION,
    value
  }
}

export function setGeneratedAnswer(question, answer) {
  return {
    type: SET_GENERATED_ANSWER,
    question,
    generatorResponse: answer.response,
    relatedResults: answer.hits
  }
}
