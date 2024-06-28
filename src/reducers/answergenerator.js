import { SET_GENERATED_ANSWER, SET_QUESTION } from "../actions/answergenerator";

const initialState = {
  question: null,
  generatorResponse: null
};

export default function answergenerator(state = initialState, action) {
  switch (action.type) {

    case SET_QUESTION:
      return Object.assign({}, state, {
        question: action.value
      })

    case SET_GENERATED_ANSWER:
      return Object.assign({}, state, action);

    default:
      return state;
  }
}
