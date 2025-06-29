import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Collapsible.module.scss";
import { WobbleRotate } from "../../../../../../Animation";
import { useDropDownContext } from "../../../../hooks";
import { DownArrowIcon, DropDownTicked } from "../../../../../../Icons";
import actionTypes from "../../../../state/actionTypes";
import PropTypes from "prop-types";
function Collapsible({
  item,
  onChange,
  customOptionRenderer,
  canShowTickIcon,
  automationIdPrefix,
  menuItems,
}) {
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch } = context;
  const optionsRef = useRef();
  const [optionsHeight, setOptionsHeight] = useState("auto");
  const [optionsInitialHeight, setOptionsInitialHeight] = useState("auto");

  const itemSelected = useCallback(
    (op) => {
      return (
        op.label === dropDownState.selectedItem?.label &&
        op.value === dropDownState.selectedItem?.value
      );
    },
    [dropDownState.selectedItem]
  );

  const onClick = (item) => {
    onChange(item);
    dropDownDispatch({
      type: actionTypes.HIDE_DROP_DOWN,
      payload: {
        menuItems: menuItems,
      },
    });
    dropDownDispatch({
      type: actionTypes.SET_SELECTED_ITEM,
      payload: { selectedItem: item },
    });
  };

  const onClickTrigger = () => {
    const optionGroupExpanded = {
      ...dropDownState.optionGroupExpanded,
    };
    optionGroupExpanded[item.groupTitle] =
      !dropDownState.optionGroupExpanded[item.groupTitle];
    dropDownDispatch({
      type: actionTypes.SET_OPTION_GROUP_EXPANDED,
      payload: { optionGroupExpanded },
    });
  };

  const onOptionListTransitionEnd = (event) => {
    event.stopPropagation();
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  useEffect(
    function initHeight() {
      const { height } = optionsRef.current.getBoundingClientRect();
      if (height !== 0) {
        setOptionsInitialHeight(height + "px");
        setOptionsHeight(height + "px");
      }
    },
    [dropDownState.active]
  );

  useEffect(
    function toggleOptions() {
      setOptionsHeight(
        dropDownState.optionGroupExpanded[item.groupTitle]
          ? optionsInitialHeight
          : "0px"
      );
    },
    [dropDownState.optionGroupExpanded, item.groupTitle, optionsInitialHeight]
  );

  const optionTemplate = useCallback(
    ({ op }) => {
      if (customOptionRenderer) {
        const CustomOptionTemplate = customOptionRenderer;
        const data = {
          selected: itemSelected(op),
          label: op.label,
          value: op.value,
          isDisabled: op.isDisabled,
        };
        return <CustomOptionTemplate data={data} />;
      } else {
        return (
          <>
            <span
              className={`${styles.label} ${
                op.isDisabled ? styles.disabled : ""
              }`}
            >
              {op.label}
            </span>
            {canShowTickIcon && itemSelected(op) ? (
              <div className={styles.iconContainer}>
                <DropDownTicked className="no-hover" />
              </div>
            ) : null}
          </>
        );
      }
    },
    [customOptionRenderer, itemSelected, canShowTickIcon]
  );

  return (
    <div className={styles.collapsible}>
      <div className={styles.trigger} onClick={onClickTrigger}>
        <span>{item.groupTitle}</span>
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
        style={{ height: optionsHeight }}
        onTransitionEnd={onOptionListTransitionEnd}
      >
        {item.options?.map((op, index) => (
          <li
            key={index}
            className={`${styles.titledOptionsListItem} ${
              itemSelected(op) ? styles.selected : ""
            } ${op.isDisabled ? styles.disabled : ""}`}
            onClick={() => !op.isDisabled && onClick(op)}
            onTransitionEnd={(event) => event.stopPropagation()}
            role="menuitem"
            title={op.label}
            data-dz-unique-id={`${automationIdPrefix}-${1667223578037}-${op.value?.toLowerCase()}-dropdown`}
          >
            {optionTemplate({ op })}
          </li>
        ))}
      </ul>
    </div>
  );
}

Collapsible.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func,
  customOptionRenderer: PropTypes.func,
  canShowTickIcon: PropTypes.bool,
  automationIdPrefix: PropTypes.string,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  menuItems: PropTypes.array,
};

export default Collapsible;
