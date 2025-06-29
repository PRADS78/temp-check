import { KeyCode } from "../../../../Enums";

function setHighlightedItem({ state, action }) {
  let highlightedIndex = state.highlightedItem.index;
  const menuItems = state.searchText
    ? state.filteredItems
    : action.payload.items;

  const onArrowUp = () => {
    if (highlightedIndex === -1) {
      highlightedIndex = menuItems.length; // Setting the last item as highlighted when there is no highlighted item
    }
    let previousItem = menuItems[highlightedIndex - 1];
    while (highlightedIndex > 0 && previousItem.isDisabled) {
      --highlightedIndex;
      previousItem = menuItems[highlightedIndex - 1]; // Picks previous item for the decremented highlighted index
    }
    --highlightedIndex; // Decrements the highlighted index from the previous identified enabled item
    if (typeof previousItem === "undefined") {
      highlightedIndex = state.highlightedItem.index; // Setting the existing highlighted index when it's the last enabled item
    }
  };

  const onArrowDown = () => {
    let nextItem = menuItems[highlightedIndex + 1];
    while (highlightedIndex < menuItems.length - 1 && nextItem.isDisabled) {
      ++highlightedIndex;
      nextItem = menuItems[highlightedIndex + 1]; // Picks next item for the incremented highlighted index
    }
    ++highlightedIndex; // Increments the highlighted index from the previous identified enabled item
    if (typeof nextItem === "undefined") {
      highlightedIndex = state.highlightedItem.index; // Setting the existing highlighted index when it's the last enabled item
    }
  };

  switch (action.payload.keyCode) {
    case KeyCode.ARROW_DOWN:
      onArrowDown();
      break;
    case KeyCode.ARROW_UP:
      onArrowUp();
      break;
    case KeyCode.MOUSE_ENTER:
    case KeyCode.MOUSE_LEAVE:
      highlightedIndex = action.payload.index;
  }

  const itemToHighlight = menuItems.find(
    (_, index) => index === highlightedIndex
  );

  return {
    ...state,
    highlightedItem: {
      item: itemToHighlight,
      index: highlightedIndex,
    },
  };
}

export default setHighlightedItem;
