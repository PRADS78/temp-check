import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Collapsible.module.scss";
import { WobbleRotate } from "../../../../../../Animation";
import { useDropDownContext } from "../../../../hooks";
import actionTypes from "../../../../state/actionTypes";
import PropTypes from "prop-types";
import { Checkbox } from "../../../../../Checkbox";
import { DownArrowIcon } from "../../../../../../Icons";

function Collapsible({ item, menuItems }) {
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch } = context;
  const optionsRef = useRef();
  const [optionsHeight, setOptionsHeight] = useState("auto");
  const { checkedItems, active, filteredItems } = dropDownState;

  const groupItems = useMemo(() => {
    return menuItems.filter(
      (menuItem) => menuItem.groupTitle === item.groupTitle
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupChecked = useMemo(() => {
    const checkedGroupItems = checkedItems.filter(
      (checked) => checked.groupTitle === item.groupTitle
    );
    return groupItems.length === checkedGroupItems.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems, menuItems]);

  const onCheck = useCallback(
    ({ event, op }) => {
      if (event.target.checked) {
        dropDownDispatch({
          type: actionTypes.ADD_CHECKED_ITEM,
          payload: { checkedItem: op },
        });
      } else {
        dropDownDispatch({
          type: actionTypes.REMOVE_CHECKED_ITEM,
          payload: { item: op },
        });
      }
      dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
    },
    [dropDownDispatch]
  );

  const onClickTrigger = (event) => {
    const optionGroupExpanded = {
      ...dropDownState.optionGroupExpanded,
    };
    optionGroupExpanded[item.groupTitle] =
      !dropDownState.optionGroupExpanded[item.groupTitle];
    dropDownDispatch({
      type: actionTypes.SET_OPTION_GROUP_EXPANDED,
      payload: { optionGroupExpanded },
    });
    event.stopPropagation();
  };

  const onOptionListTransitionEnd = (event) => {
    event.stopPropagation();
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  const onSelectGroup = () => {
    if (groupChecked) {
      dropDownDispatch({
        type: actionTypes.REMOVE_MULTIPLE_CHECKED_ITEMS,
        payload: { removalList: [...groupItems] },
      });
    } else {
      const unCheckedGroupItems = groupItems.filter((groupItem) => {
        const checked = checkedItems.find((checkedItem) => {
          return (
            checkedItem.label === groupItem.label &&
            checkedItem.value === groupItem.value
          );
        });
        return !checked && !groupItem.isDisabled;
      });
      dropDownDispatch({
        type: actionTypes.ADD_MULTIPLE_CHECKED_ITEMS,
        payload: { multipleCheckedItems: [...unCheckedGroupItems] },
      });
    }
  };

  useEffect(
    function initHeight() {
      const { height } =
        optionsRef.current.firstElementChild.getBoundingClientRect();
      if (dropDownState.optionGroupExpanded[item.groupTitle]) {
        setOptionsHeight(
          height * item.options.length + item.options.length * 4 + "px"
        );
      } else {
        setOptionsHeight("0px");
      }
    },
    [
      active,
      dropDownState.optionGroupExpanded,
      filteredItems,
      item.groupTitle,
      item.options,
    ]
  );

  const isItemChecked = (op) => {
    return (
      checkedItems.find(
        (check) => check.label === op.label && check.value === op.value
      ) !== undefined
    );
  };

  return (
    <div className={styles.collapsible}>
      <div
        className={`${styles.trigger} ${styles.titleGroup}`}
        onClick={onClickTrigger}
      >
        <div
          className={styles.selectGroup}
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            isChecked={groupChecked}
            onChange={onSelectGroup}
            label={item.groupTitle}
            uniqueId={`${1667223361827}-${item.groupTitle}`}
          />
        </div>
        <WobbleRotate in={dropDownState.optionGroupExpanded[item.groupTitle]}>
          <span
            className={styles.iconContainer}
            style={{
              transform: !dropDownState.optionGroupExpanded[item.groupTitle]
                ? "rotate(0deg)"
                : "rotate(180deg)",
            }}
          >
            <DownArrowIcon />
          </span>
        </WobbleRotate>
      </div>
      <ul
        className={styles.titledOptionsList}
        ref={optionsRef}
        onTransitionEnd={onOptionListTransitionEnd}
        style={{ height: optionsHeight }}
      >
        {item.options?.map((op, index) => (
          <li
            key={index}
            className={`${styles.titledOptionsListItem} ${
              isItemChecked(op) ? styles.selected : ""
            }   `}
            onTransitionEnd={(event) => event.stopPropagation()}
            role="menuitem"
            title={op.label}
          >
            <Checkbox
              isChecked={
                checkedItems.find(
                  (check) =>
                    check.label === op.label && check.value === op.value
                ) !== undefined
              }
              onChange={(event) => onCheck({ event, op })}
              label={op.label}
              isDisabled={op.isDisabled}
              uniqueId={`${1667224339168}-${op.value}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

Collapsible.propTypes = {
  item: PropTypes.object,
  menuItems: PropTypes.array,
};

export default Collapsible;
