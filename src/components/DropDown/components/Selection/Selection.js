import styles from "./Selection.module.scss";
import { Multiple } from "./Multiple";
import { Single } from "./Single";
import { useDropDownContext } from "../../hooks";
import PropTypes from "prop-types";
import actionTypes from "../../state/actionTypes";
import { InteractionType, DropDownOptionTypes } from "../../../../Enums";
import { useEffect } from "react";
function Selection(props) {
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch, listBoxRef } = context;
  const activeStyle = dropDownState.active ? styles.active : "";
  const disabledStyle = props.isDisabled ? styles.disabled : "";

  const setDropdownActive = (isActive) => {
    if (isActive) {
      dropDownDispatch({
        type: actionTypes.SHOW_DROP_DOWN,
      });
    } else {
      dropDownDispatch({
        type: actionTypes.HIDE_DROP_DOWN,
        payload: {
          menuItems: props.menuItems,
        },
      });
    }
  };

  const setKeyboardInteraction = () => {
    dropDownDispatch({
      type: actionTypes.SET_INTERACTION_TYPE,
      payload: {
        interactionType: InteractionType.KEYBOARD,
      },
    });
  };

  const setHighlightedItem = (event) => {
    dropDownDispatch({
      type: actionTypes.SET_HIGHLIGHTED_ITEM,
      payload: {
        keyCode: event.code,
        items: props.menuItems,
      },
    });
  };

  useEffect(() => {
    if (
      dropDownState.highlightedItem.item !== undefined &&
      dropDownState.active &&
      dropDownState.interactionType === InteractionType.KEYBOARD &&
      props.itemType === DropDownOptionTypes.STANDARD
    ) {
      listBoxRef.current.children[
        dropDownState.highlightedItem.index
      ].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [
    dropDownState.active,
    dropDownState.highlightedItem.index,
    dropDownState.highlightedItem.item,
    dropDownState.interactionType,
    listBoxRef,
    props.itemType,
  ]);

  return (
    <span className={`${styles.selection} ${activeStyle} ${disabledStyle}`}>
      {props.isMulti ? (
        <Multiple
          isClearable={props.isClearable}
          isSearchable={props.isSearchable}
          menuItems={props.menuItems}
          onChange={props.onChange}
          placeholder={props.placeholder}
          isDropDownDisabled={props.isDisabled}
          setDropdownActive={setDropdownActive}
          setKeyboardInteraction={setKeyboardInteraction}
          setHighlightedItem={setHighlightedItem}
        />
      ) : (
        <Single
          menuItems={props.menuItems}
          isSearchable={
            !props.isSearchDisabledTemporarily && props.isSearchable
          }
          onChange={props.onChange}
          placeholder={props.placeholder}
          setDropdownActive={setDropdownActive}
          setKeyboardInteraction={setKeyboardInteraction}
          setHighlightedItem={setHighlightedItem}
        />
      )}
    </span>
  );
}

Selection.propTypes = {
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  isSearchDisabledTemporarily: PropTypes.bool,
  itemType: PropTypes.oneOf([Object.values(DropDownOptionTypes)]),
};

export default Selection;
