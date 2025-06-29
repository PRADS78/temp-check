import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Multiple.module.scss";
import { ItemSearch } from "../../ItemSearch";
import { useComboBox, useDropDownContext } from "../../../hooks";
import actionTypes from "../../../state/actionTypes";
import PropTypes from "prop-types";
import { Chip } from "../../../../Chips";

function Multiple(props) {
  const context = useDropDownContext();
  const searchRef = useRef();
  const [listRef, setListRef] = useState(null);
  const { dropDownState, dropDownDispatch, comboBoxRef } = context;
  const { active, checkedItems } = dropDownState;
  const { onChange, placeholder, isDropDownDisabled } = props;
  const [selectionOverflown, setSelectionOverflown] = useState(false);
  const chipsWidthRef = useRef({});

  const toggleAnItem = () => {
    const highlightedItem = dropDownState.highlightedItem.item;
    if (highlightedItem.isDisabled ?? false) {
      return;
    }
    const isAlreadyChecked = checkedItems.find((item) => {
      return item.value === highlightedItem.value;
    });
    if (isAlreadyChecked) {
      // TODO: What should we do if the item is already checked and triggered from onTab?
      dropDownDispatch({
        type: actionTypes.REMOVE_CHECKED_ITEM,
        payload: { item: dropDownState.highlightedItem.item },
      });
    } else {
      dropDownDispatch({
        type: actionTypes.ADD_CHECKED_ITEM,
        payload: {
          checkedItem: dropDownState.highlightedItem.item,
          highlightedIndex: dropDownState.highlightedItem.index,
        },
      });
    }
  };

  const setSelectedItem = (isActive) => {
    if (!isActive) {
      props.setDropdownActive(false);
    } else {
      toggleAnItem();
    }
  };

  const onTab = (isActive) => {
    if (isActive) {
      toggleAnItem();
      props.setDropdownActive(false);
    }
  };

  const onBackspace = (event) => {
    if (dropDownState.searchText.length === 0) {
      event.preventDefault();
      dropDownDispatch({
        type: actionTypes.REMOVE_CHECKED_ITEM,
        payload: { canRemoveTheLastItem: true },
      });
    }
  };

  useComboBox({
    comboBoxRef,
    isActive: active,
    setActive: props.setDropdownActive,
    setInteractionType: props.setKeyboardInteraction,
    setHighlightedItem: props.setHighlightedItem,
    setSelectedItem: setSelectedItem,
    focusInput: () => {
      if (props.isSearchable) {
        comboBoxRef.current?.focus();
      }
    },
    onTab: onTab,
    onBackspace: onBackspace,
  });

  useEffect(
    function focusSearch() {
      searchRef.current?.focus();
    },
    [active]
  );

  useEffect(
    function storeChipsOriginalWidth() {
      if (listRef && checkedItems.length > 0) {
        const multi = listRef;
        if (multi.clientWidth < multi.scrollWidth) {
          Array.prototype.forEach.call(multi.children, (chip) => {
            if (
              chip.getBoundingClientRect().right <
              multi.getBoundingClientRect().right
            ) {
              const chipWidth = chip.getBoundingClientRect().width;
              if (
                chip.innerText &&
                typeof chipsWidthRef.current[chip.innerText] === "undefined"
              ) {
                chipsWidthRef.current[chip.innerText] = chipWidth;
              }
            }
          });
        }
      }
    },
    [checkedItems.length, listRef]
  );

  useEffect(
    function adjustChipsWidth() {
      if (listRef && checkedItems.length > 0) {
        const multi = listRef;
        if (multi.clientWidth < multi.scrollWidth) {
          Array.prototype.forEach.call(multi.children, (chip) => {
            if (
              chip.getBoundingClientRect().right <
              multi.getBoundingClientRect().right
            ) {
              const chipWidth = chipsWidthRef.current[chip.innerText];
              if (chipWidth > 100) {
                chip.style.width = `100px`;
              }
              setSelectionOverflown(true);
            }
          });
        } else {
          setSelectionOverflown(false);
        }
      } else {
        setSelectionOverflown(false);
      }
    },
    [checkedItems.length, listRef]
  );

  const renderSelectionTemplate = useCallback(() => {
    const onClick = ({ e, checked }) => {
      e.stopPropagation();
      dropDownDispatch({
        type: actionTypes.REMOVE_CHECKED_ITEM,
        payload: { item: checked },
      });
      const checkedClone = [...checkedItems];
      const target = checked;
      const targetIndex = checkedClone.findIndex((checkedItem) => {
        return (
          checkedItem.label === target.label &&
          checkedItem.value === target.value
        );
      });
      checkedClone.splice(targetIndex, 1);
      onChange(checkedClone);
    };

    const onClickList = (e) => {
      if (isDropDownDisabled) {
        e.stopPropagation();
        return;
      }
      dropDownDispatch({ type: actionTypes.SHOW_DROP_DOWN });
    };

    const placeholderElement = (
      <div className={styles.placeholder}>{placeholder}</div>
    );

    if (checkedItems.length >= 1) {
      return (
        <>
          <ul ref={setListRef} className={styles.list} onClick={onClickList}>
            {checkedItems.slice(0, checkedItems.length).map((checked) => {
              return (
                <Chip
                  key={checked.value}
                  label={checked.selectedLabel ?? checked.label}
                  onClick={(e) => onClick({ e, checked })}
                  uniqueId={`${1667221074760}-${checked.value}`}
                  canShowClose={true}
                  onClose={(e) => onClick({ e, checked })}
                  isDisabled={isDropDownDisabled}
                />
              );
            })}
          </ul>
          {selectionOverflown ? (
            <>
              <div className={styles.blurShadow}></div>
              <div>...</div>
              <div className={styles.selectedCounter}>
                {checkedItems.length}
              </div>
            </>
          ) : null}
        </>
      );
    } else {
      return placeholderElement;
    }
  }, [
    placeholder,
    checkedItems,
    dropDownDispatch,
    onChange,
    selectionOverflown,
    isDropDownDisabled,
  ]);

  return (
    <div
      className={styles.multiple}
      role="combobox"
      tabIndex={0}
      ref={comboBoxRef}
      aria-expanded={dropDownState.active}
      aria-haspopup="listbox"
      aria-activedescendant={dropDownState.highlightedItem.item?.value ?? -1}
    >
      {active && props.isSearchable ? (
        <ItemSearch menuItems={props.menuItems} ref={searchRef} />
      ) : (
        renderSelectionTemplate()
      )}
    </div>
  );
}

Multiple.propTypes = {
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      selectedLabel: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  isDropDownDisabled: PropTypes.bool,
  setDropdownActive: PropTypes.func,
  setKeyboardInteraction: PropTypes.func,
  setHighlightedItem: PropTypes.func,
};

export default Multiple;
