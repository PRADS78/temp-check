import actionTypes from "./actionTypes";
import handlers from "./actions/index";

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_CHECKED_ITEM:
      return handlers.addCheckedItem({ state, action });
    case actionTypes.ADD_MULTIPLE_CHECKED_ITEMS:
      return handlers.addMultipleCheckedItems({ state, action });
    case actionTypes.CLEAR_ALL:
      return handlers.clearAll({ state, action });
    case actionTypes.HIDE_DROP_DOWN:
      return handlers.hideDropDown({ state, action });
    case actionTypes.NOTIFY_COLLAPSIBLE_ACTION:
      return handlers.notifyCollapsibleAction({ state });
    case actionTypes.REMOVE_CHECKED_ITEM:
      return handlers.removeCheckedItem({ state, action });
    case actionTypes.REMOVE_MULTIPLE_CHECKED_ITEMS:
      return handlers.removeMultipleCheckedItems({ state, action });
    case actionTypes.SELECT_ALL:
      return handlers.selectAll({ state, action });
    case actionTypes.SET_FILTERED_ITEMS:
      return handlers.setFilteredItems({ state, action });
    case actionTypes.SET_MULTIPLE_SELECTED_ITEMS:
      return handlers.setMultipleSelectedItems({ state, action });
    case actionTypes.SET_OPTION_GROUP_EXPANDED:
      return handlers.setOptionGroupExpanded({ state, action });
    case actionTypes.SET_SELECTED_ITEM:
      return handlers.setSelectedItem({ state, action });
    case actionTypes.SHOW_DROP_DOWN:
      return handlers.showDropDown({ state });
    case actionTypes.UPDATE_SEARCH_TEXT:
      return handlers.updateSearchText({ state, action });
    case actionTypes.SET_HIGHLIGHTED_ITEM:
      return handlers.setHighlightedItem({ state, action });
    case actionTypes.SET_INTERACTION_TYPE:
      return handlers.setInteractionType({ state, action });
    default:
      throw new Error(`${action.type} is not supported by the reducer`);
  }
}

export default reducer;
