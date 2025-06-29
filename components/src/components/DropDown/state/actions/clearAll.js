function clearAll({ state, action }) {
  return {
    ...state,
    checkedItems: [],
    filteredItems: [...action.payload.filteredItems],
    searchText: "",
  };
}

export default clearAll;
