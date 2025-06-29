function setFilteredItems({ state, action }) {
  const isHighlightedItemOnList = action.payload.filteredItems.find((item) => {
    return item.value === state.highlightedItem.item?.value;
  });

  let highlightIndex = 0;
  let itemToHighlight = action.payload.filteredItems[highlightIndex];

  while (
    itemToHighlight &&
    itemToHighlight.isDisabled &&
    !isHighlightedItemOnList
  ) {
    highlightIndex++;
    itemToHighlight = action.payload.filteredItems[highlightIndex];
  }

  return {
    ...state,
    filteredItems: [...action.payload.filteredItems],
    highlightedItem:
      state.searchText !== "" && !isHighlightedItemOnList
        ? {
            item: itemToHighlight,
            index: itemToHighlight ? highlightIndex : -1,
          }
        : state.highlightedItem,
  };
}

export default setFilteredItems;
