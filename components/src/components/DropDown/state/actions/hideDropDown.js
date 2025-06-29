function hideDropDown({ state, action }) {
  const highlightedIndex = action.payload.menuItems.findIndex((item) => {
    return item.value === state.selectedItem?.value;
  });
  return {
    ...state,
    active: false,
    searchText: "",
    highlightedItem: {
      item: state.selectedItem ?? undefined,
      index: highlightedIndex,
    },
    filteredItems: [...action.payload.menuItems],
    interactionType: undefined,
  };
}

export default hideDropDown;
