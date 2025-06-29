function setSelectedItem({ state, action }) {
  return {
    ...state,
    selectedItem: action.payload.selectedItem,
    highlightedItem: {
      item: action.payload.selectedItem,
      index: action.payload.highlightedIndex,
    },
  };
}

export default setSelectedItem;
