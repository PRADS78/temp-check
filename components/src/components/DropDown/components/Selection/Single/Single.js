import { useEffect, useRef } from "react";
import styles from "./Single.module.scss";
import PropTypes from "prop-types";
import { ItemSearch } from "../../ItemSearch";
import { useDropDownContext, useComboBox } from "../../../hooks";
import actionTypes from "../../../state/actionTypes";

function Single(props) {
  const context = useDropDownContext();
  const searchRef = useRef();
  const { dropDownState, dropDownDispatch, comboBoxRef } = context;
  const { active } = dropDownState;

  const focusInput = () => {
    /* istanbul ignore else */
    if (props.isSearchable) {
      comboBoxRef.current?.focus();
    }
  };

  const selectAnItem = () => {
    const highlightedItem = dropDownState.highlightedItem.item;
    const isDifferentItem =
      dropDownState.selectedItem?.value !== highlightedItem?.value;
    const isHighlightedItemDisabled = highlightedItem?.isDisabled ?? false;
    /* istanbul ignore else */
    if (highlightedItem && !isHighlightedItemDisabled && isDifferentItem) {
      dropDownDispatch({
        type: actionTypes.SET_SELECTED_ITEM,
        payload: {
          selectedItem: dropDownState.highlightedItem.item,
          highlightedIndex: dropDownState.highlightedItem.index,
        },
      });
      props.onChange(dropDownState.highlightedItem.item);
    }
    /* istanbul ignore else */
    if (!isHighlightedItemDisabled && highlightedItem !== undefined) {
      props.setDropdownActive(false);
      focusInput();
    }
  };

  const setSelectedItem = (isActive) => {
    if (!isActive) {
      props.setDropdownActive(false);
    } else {
      selectAnItem();
    }
  };

  useComboBox({
    comboBoxRef,
    isActive: active,
    setActive: props.setDropdownActive,
    setHighlightedItem: props.setHighlightedItem,
    setInteractionType: props.setKeyboardInteraction,
    focusInput,
    setSelectedItem,
    onTab: (isActive) => {
      if (isActive) {
        selectAnItem();
      }
    },
  });

  useEffect(
    function focusSearch() {
      searchRef.current?.focus();
    },
    [active]
  );

  const renderSelectionTemplate = () => {
    return dropDownState.selectedItem ? (
      <span className={styles.selectedItem}>
        {dropDownState.selectedItem.selectedLabel ??
          dropDownState.selectedItem.label}
      </span>
    ) : (
      <span className={styles.placeholder}>{props.placeholder}</span>
    );
  };

  return (
    <div
      className={styles.single}
      role="combobox"
      tabIndex={0}
      ref={comboBoxRef}
      aria-expanded={dropDownState.active}
      aria-haspopup="listbox"
      aria-activedescendant={dropDownState.highlightedItem.item?.value ?? -1}
    >
      {dropDownState.active && props.isSearchable ? (
        <ItemSearch menuItems={props.menuItems} ref={searchRef} />
      ) : (
        renderSelectionTemplate() // Technically the input should be hidden behind the selection template
      )}
    </div>
  );
}

Single.propTypes = {
  isSearchable: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
      selectedLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
    })
  ).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  setDropdownActive: PropTypes.func,
  setKeyboardInteraction: PropTypes.func,
  setHighlightedItem: PropTypes.func,
};

export default Single;
