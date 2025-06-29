const initialState = {
  active: false,
  collapsibleNotification: Date.now(),
  checkedItems: [],
  filteredItems: [],
  optionGroupExpanded: {},
  searchText: "",
  selectedItem: null,
  highlightedItem: { item: undefined, index: -1 },
  interactionType: undefined,
};
export default initialState;
