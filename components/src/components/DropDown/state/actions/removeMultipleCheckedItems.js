function removeMultipleCheckedItems({ state, action }) {
  const checkedClone = [...state.checkedItems];
  const trimmedCheckedItems = checkedClone.reduce((acc, curr) => {
    const included = action.payload.removalList.find((listItem) => {
      return listItem.value === curr.value && listItem.label === curr.label;
    });
    return included ? acc : [...acc, curr];
  }, []);

  return {
    ...state,
    checkedItems: [...trimmedCheckedItems],
  };
}

export default removeMultipleCheckedItems;
