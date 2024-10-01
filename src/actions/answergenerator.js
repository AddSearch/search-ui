export const SET_GENERATED_ANSWER = 'SET_GENERATED_ANSWER';
export const SET_QUESTION = 'SET_QUESTION';

export function askQuestion(client, question, store) {

  return dispatch => {
    client.generateAnswer(question, (res) => {
      dispatch(setGeneratedAnswer(question, res));
    });
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
