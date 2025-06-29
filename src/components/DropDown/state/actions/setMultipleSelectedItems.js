function setMultipleSelectedItems({ state, action }) {
  return {
    ...state,
    checkedItems: [...action.payload.multipleSelectedItems],
  };
}

export default setMultipleSelectedItems;
