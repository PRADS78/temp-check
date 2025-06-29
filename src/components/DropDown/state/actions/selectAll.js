function selectAll({ state, action }) {
  const getCheckedItemsValue = () => {
    return state.checkedItems.reduce((acc, item) => {
      return {
        ...acc,
        [item.value]: true,
      };
    }, {});
  };

  const items =
    state.searchText.toLowerCase().length > 0
      ? state.filteredItems
      : action.payload.items;

  const itemsToCheck = items.filter((item) => {
    return getCheckedItemsValue()[item.value] === undefined && !item.isDisabled;
  });

  return {
    ...state,
    checkedItems: state.checkedItems.concat(itemsToCheck),
    filteredItems: [...action.payload.items],
    searchText: "",
  };
}

export default selectAll;
