function addMultipleCheckedItems({ state, action }) {
  return {
    ...state,
    checkedItems: [
      ...state.checkedItems,
      ...action.payload.multipleCheckedItems,
    ],
  };
}

export default addMultipleCheckedItems;
