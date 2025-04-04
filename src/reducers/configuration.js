const initialState = {
  searchPersistence: 'url'
};

export default function configuration(state = initialState) {
  return {
    ...initialState,
    ...state
  };
}
