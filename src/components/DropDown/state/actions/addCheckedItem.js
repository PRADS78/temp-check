function addCheckedItem({ state, action }) {
  return {
    ...state,
    checkedItems: [...state.checkedItems, action.payload.checkedItem],
    highlightedIndex: action.payload.highlightedIndex,
  };
}

export default addCheckedItem;
