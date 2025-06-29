import { useCallback, useEffect, useMemo, useRef } from "react";
import styles from "./Multiple.module.scss";
import { useDropDownContext } from "../../../hooks";
import {
  ButtonSize,
  DropDownOptionTypes,
  InteractionType,
} from "../../../../../Enums";
import actionTypes from "../../../state/actionTypes";
import { TitledOptions } from "./TitledOptions";
import PropTypes from "prop-types";
import { OutlinedButton, PrimaryButton } from "../../../../AppButton";
import { Checkbox } from "../../../../Checkbox";
import { Chip } from "../../../../Chips";
import { useLocalizerWithNameSpace } from "../../../../../DisprzLocalizer";
function Multiple(props) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const { onChange } = props;
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch, listBoxRef } = context;
  const isNotFirstMount = useRef(false);
  const isSelectAll = useRef(false);

  const handleOnChange = useCallback(
    (val) => {
      onChange(val);
    },
    [onChange]
  );

  useEffect(() => {
    /**
     * This is a general use case other than select all
     */
    if (isNotFirstMount.current && !isSelectAll.current) {
      handleOnChange(dropDownState.checkedItems);
    }
    isNotFirstMount.current = true;
  }, [dropDownState.checkedItems, handleOnChange]);

  useEffect(() => {
    /**
     * This effect handles the use case when the user selects all the items
     * and we need to hide the dropdown at same time which results in
     * onChange not called because the dropdown is unmounted
     */
    if (isSelectAll.current) {
      dropDownDispatch({
        type: actionTypes.HIDE_DROP_DOWN,
        payload: {
          menuItems: props.menuItems,
        },
      });
      isSelectAll.current = false;
      onChange([...dropDownState.checkedItems]);
    }
  }, [dropDownDispatch, dropDownState.checkedItems, onChange, props.menuItems]);

  const allSelected = useMemo(() => {
    return props.menuItems.length === dropDownState.checkedItems.length;
  }, [props.menuItems, dropDownState.checkedItems]);

  const clearAllDisabled = useMemo(() => {
    return dropDownState.checkedItems.length === 0;
  }, [dropDownState.checkedItems]);

  const itemSelected = useCallback(
    (item) => {
      const checked = dropDownState.checkedItems;
      const checkedItem = checked.find((check) => {
        return check.label === item.label && check.value === item.value;
      });
      return checkedItem !== undefined;
    },
    [dropDownState.checkedItems]
  );

  const isHighlightedItem = useCallback(
    (item) => dropDownState.highlightedItem.item?.value === item?.value,
    [dropDownState.highlightedItem.item?.value]
  );

  const onCheck = useCallback(
    ({ event, item }) => {
      if (event.target.checked) {
        dropDownDispatch({
          type: actionTypes.ADD_CHECKED_ITEM,
          payload: { checkedItem: item },
        });
      } else {
        dropDownDispatch({
          type: actionTypes.REMOVE_CHECKED_ITEM,
          payload: { item },
        });
      }
      dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
    },
    [dropDownDispatch]
  );

  const onClearAll = () => {
    dropDownDispatch({
      type: actionTypes.CLEAR_ALL,
      payload: { filteredItems: [...props.menuItems] },
    });
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  const onClickChip = ({ checked }) => {
    dropDownDispatch({
      type: actionTypes.REMOVE_CHECKED_ITEM,
      payload: { item: checked },
    });
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  const onSelectAll = () => {
    isSelectAll.current = true;
    dropDownDispatch({
      type: actionTypes.SELECT_ALL,
      payload: {
        items: [...props.menuItems],
      },
    });
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  const optionsTemplate = useMemo(() => {
    if (props.itemsType === DropDownOptionTypes.STANDARD) {
      return (
        <ul ref={listBoxRef} role="listbox" tabIndex={-1}>
          {dropDownState.filteredItems.map((item, index) => {
            return (
              <MultipleOption
                key={item.value}
                item={item}
                isItemSelected={itemSelected(item)}
                isHighlightedItem={isHighlightedItem(item)}
                dispatch={dropDownDispatch}
                isMouseInteraction={
                  dropDownState.interactionType === InteractionType.MOUSE ||
                  dropDownState.interactionType === undefined
                }
                menuItems={props.menuItems}
                index={index}
                onCheck={(event) => onCheck({ event, item })}
                setMouseInteraction={props.setMouseInteraction}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
              />
            );
          })}
        </ul>
      );
    } else {
      return (
        <TitledOptions
          menuItems={props.menuItems}
          automationIdPrefix={props.automationIdPrefix}
        />
      );
    }
  }, [
    props.itemsType,
    props.menuItems,
    props.setMouseInteraction,
    props.onMouseEnter,
    props.onMouseLeave,
    props.automationIdPrefix,
    listBoxRef,
    dropDownState.filteredItems,
    dropDownState.interactionType,
    itemSelected,
    isHighlightedItem,
    dropDownDispatch,
    onCheck,
  ]);

  return (
    <div
      className={styles.multiple}
      onClick={(event) => event.stopPropagation()}
    >
      <ul
        className={`${styles.chipsList} ${
          dropDownState.checkedItems.length > 0
            ? props.itemsType === DropDownOptionTypes.GROUPED
              ? styles.paddedGrouped
              : styles.padded
            : ""
        }`}
      >
        {dropDownState.checkedItems.map((checked, index) => {
          return (
            <li key={index}>
              <Chip
                onClick={(e) => onClickChip({ e, checked })}
                label={checked.label}
                uniqueId={`${1667220927419}-${checked.value}`}
                canShowClose={true}
                onClose={(e) => onClickChip({ e, checked })}
              />
            </li>
          );
        })}
      </ul>

      {dropDownState.filteredItems.length >= 1 ? (
        optionsTemplate
      ) : (
        <div className={styles.noItemsNotice}>No items found</div>
      )}

      <div
        className={`${styles.compoundButtons} ${
          props.itemsType === DropDownOptionTypes.GROUPED
            ? styles.buttonContainer
            : ""
        }`}
      >
        <OutlinedButton
          ctrCls={styles.clearBtn}
          label={`${t("common.clear")} ${t("common.all")}`}
          isDisabled={clearAllDisabled}
          onClick={onClearAll}
          size={ButtonSize.SMALL}
          uniqueId={1667220764869}
        />
        <PrimaryButton
          ctrCls={styles.searchBtn}
          label={`${t("common.select")} ${t("common.all")}`}
          isDisabled={allSelected}
          onClick={onSelectAll}
          size={ButtonSize.SMALL}
          uniqueId={1667220775345}
        />
      </div>
    </div>
  );
}

Multiple.propTypes = {
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  itemsType: PropTypes.oneOf([
    DropDownOptionTypes.STANDARD,
    DropDownOptionTypes.GROUPED,
  ]),
  automationIdPrefix: PropTypes.string,
  setMouseInteraction: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const MultipleOption = ({
  item,
  isItemSelected,
  isHighlightedItem,
  isMouseInteraction,
  index,
  onCheck,
  setMouseInteraction,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <li
      tabIndex={-1}
      id={item.value}
      className={`${styles.optionItem ?? ""} ${styles.listItem} ${
        isItemSelected ? styles.selected : ""
      } ${isHighlightedItem ? styles.highlightedItem : ""}`}
      role="option"
      aria-selected={isItemSelected}
      aria-disabled={item.isDisabled}
      title={typeof item.label === "string" ? item.label : item.title}
      onMouseEnter={() => {
        setMouseInteraction();
        if (!isHighlightedItem && !item.isDisabled && isMouseInteraction) {
          onMouseEnter(index);
        }
      }}
      onMouseLeave={() => {
        setMouseInteraction();
        if (!item.isDisabled && isMouseInteraction) {
          onMouseLeave();
        }
      }}
    >
      <Checkbox
        isChecked={isItemSelected}
        onChange={onCheck}
        label={item.label}
        isDisabled={item.isDisabled}
        uniqueId={`${1667220798927}-${item.value}`}
      />
    </li>
  );
};

MultipleOption.propTypes = {
  item: PropTypes.object,
  isItemSelected: PropTypes.bool,
  isHighlightedItem: PropTypes.bool,
  index: PropTypes.number,
  onCheck: PropTypes.func,
  isMouseInteraction: PropTypes.bool,
  setMouseInteraction: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Multiple;
