import { useCallback } from "react";
import styles from "./Single.module.scss";
import { DropDownOptionTypes, InteractionType } from "../../../../../Enums";
import { useDropDownContext } from "../../../hooks";
import actionTypes from "../../../state/actionTypes";
import { TitledOptions } from "./TitledOptions";
import PropTypes from "prop-types";
import { DropDownTicked } from "../../../../../Icons";
import { useLocalizerWithNameSpace } from "../../../../../DisprzLocalizer";
function Single(props) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch, listBoxRef } = context;
  const { selectedItem } = dropDownState;

  const isSelectedItem = useCallback(
    (item) => {
      return item.value === selectedItem?.value;
    },
    [selectedItem]
  );

  const isHighlightedItem = useCallback(
    (item) => dropDownState.highlightedItem.item?.value === item?.value,
    [dropDownState.highlightedItem.item?.value]
  );

  const onClick = (item, index) => {
    if (!isSelectedItem(item)) {
      props.onChange(item);
      context.dropDownDispatch({
        type: actionTypes.SET_SELECTED_ITEM,
        payload: { selectedItem: item, highlightedIndex: index },
      });
    }
    context.dropDownDispatch({
      type: actionTypes.HIDE_DROP_DOWN,
      payload: {
        menuItems: props.menuItems,
      },
    });
  };

  const renderOptionTemplate = useCallback(
    ({ item }) => {
      if (props.customOptionRenderer) {
        const CustomOptionTemplate = props.customOptionRenderer;
        const data = {
          selected: isSelectedItem(item),
          label: item.label,
          value: item.value,
          isDisabled: item.isDisabled,
        };
        return <CustomOptionTemplate data={data} />;
      } else {
        return (
          <>
            <span
              className={`${styles.text} ${
                item.isDisabled ? styles.disabled : ""
              }`}
            >
              {item.label}
            </span>
            {props.canShowTickIcon && isSelectedItem(item) ? (
              <div className={styles.iconContainer}>
                <DropDownTicked className="no-hover" />
              </div>
            ) : null}
          </>
        );
      }
    },
    [props.customOptionRenderer, isSelectedItem, props.canShowTickIcon]
  );

  if (props.itemsType === DropDownOptionTypes.STANDARD) {
    return (
      <ul
        className={styles.single}
        onClick={(event) => event.stopPropagation()}
        role="listbox"
        tabIndex={-1}
        ref={listBoxRef}
      >
        {dropDownState.filteredItems.length >= 1 ? (
          dropDownState.filteredItems.map((item, index) => {
            return (
              <SingleOption
                index={index}
                key={item.value}
                item={item}
                isSelectedItem={isSelectedItem(item)}
                isHighlightedItem={isHighlightedItem(item)}
                dispatch={dropDownDispatch}
                menuItems={props.menuItems}
                onClick={onClick}
                automationIdPrefix={props.automationIdPrefix}
                renderOptionTemplate={renderOptionTemplate}
                isMouseInteraction={
                  dropDownState.interactionType === InteractionType.MOUSE ||
                  dropDownState.interactionType === undefined // Handling the case when it's the first interaction
                }
                setMouseInteraction={props.setMouseInteraction}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
              />
            );
          })
        ) : (
          <li className={styles.noItemsNotice} role="option">
            {t("common.noItemsFound")}
          </li>
        )}
      </ul>
    );
  }

  return (
    <TitledOptions
      customOptionRenderer={props.customOptionRenderer}
      menuItems={dropDownState.filteredItems}
      onChange={props.onChange}
      canShowTickIcon={props.canShowTickIcon}
      automationIdPrefix={props.automationIdPrefix}
    />
  );
}

Single.propTypes = {
  customOptionRenderer: PropTypes.func,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  itemsType: PropTypes.string,
  canShowTickIcon: PropTypes.bool,
  automationIdPrefix: PropTypes.string,
  setMouseInteraction: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const SingleOption = ({
  item,
  isSelectedItem,
  isHighlightedItem,
  index,
  onClick,
  automationIdPrefix,
  renderOptionTemplate,
  isMouseInteraction,
  setMouseInteraction,
  onMouseLeave,
  onMouseEnter,
}) => {
  return (
    <li
      tabIndex={-1}
      id={item.value}
      className={`${isSelectedItem ? styles.selected : ""} ${
        isHighlightedItem ? styles.highlightedItem : ""
      } ${item.isDisabled ? styles.disabled : ""}`}
      aria-selected={isSelectedItem}
      aria-disabled={item.isDisabled}
      onMouseEnter={() => {
        setMouseInteraction();
        /* istanbul ignore else */
        if (!isHighlightedItem && !item.isDisabled && isMouseInteraction) {
          onMouseEnter(index);
        }
      }}
      onMouseLeave={() => {
        setMouseInteraction();
        /* istanbul ignore else */
        if (!item.isDisabled && isMouseInteraction) {
          onMouseLeave();
        }
      }}
      onClick={() => (!item.isDisabled ? onClick(item, index) : null)}
      title={typeof item.label === "string" ? item.label : item.title}
      role="option"
      data-dz-unique-id={`${automationIdPrefix}-${1667223522207}-${String(
        item.value
      ).toLowerCase()}-dropdown`}
    >
      {renderOptionTemplate({ item })}
    </li>
  );
};

SingleOption.propTypes = {
  item: PropTypes.object,
  isSelectedItem: PropTypes.bool,
  isHighlightedItem: PropTypes.bool,
  isDisabled: PropTypes.bool,
  dispatch: PropTypes.func,
  menuItems: PropTypes.array,
  index: PropTypes.number,
  onClick: PropTypes.func,
  automationIdPrefix: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  renderOptionTemplate: PropTypes.func,
  isMouseInteraction: PropTypes.bool,
  setMouseInteraction: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Single;
