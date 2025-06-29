function updateSearchText({ state, action }) {
  return {
    ...state,
    searchText: action.payload.searchText,
  };
}

export default updateSearchText;
