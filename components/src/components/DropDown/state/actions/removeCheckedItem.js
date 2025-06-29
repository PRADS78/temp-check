function removeCheckedItem({ state, action }) {
  const checkedClone = [...state.checkedItems];
  if (action.payload.canRemoveTheLastItem) {
    checkedClone.pop();
  } else {
    const target = action.payload.item;
    const targetIndex = checkedClone.findIndex((checked) => {
      return checked.label === target.label && checked.value === target.value;
    });
    checkedClone.splice(targetIndex, 1);
  }
  return {
    ...state,
    checkedItems: checkedClone,
  };
}

export default removeCheckedItem;
