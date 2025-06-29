import { useEffect, useRef } from "react";
import styles from "./Menu.module.scss";
import { Single } from "./Single";
import { Multiple } from "./Multiple";
import { useDropDownContext } from "../../hooks";
import actionTypes from "../../state/actionTypes";
import PropTypes from "prop-types";
import {
  DropDownOptionTypes,
  DropDownPosition,
  InteractionType,
  KeyCode,
} from "../../../../Enums";
import { DropdownPopper } from "../../../Popper";
import { PopperReferenceStrategies } from "../../../../Enums/index";

function Menu(props) {
  const context = useDropDownContext();
  const menuRef = useRef();
  const { dropDownState, dropDownDispatch, containerRef } = context;

  useEffect(
    function setInitialFilteredItems() {
      /* istanbul ignore else */
      if (props.menuItems) {
        dropDownDispatch({
          type: actionTypes.SET_FILTERED_ITEMS,
          payload: { filteredItems: props.menuItems },
        });
      }
    },
    [props.menuItems, dropDownDispatch]
  );

  useEffect(
    function setInitialOptionGroupsExpandedStates() {
      if (props.itemsType === DropDownOptionTypes.GROUPED) {
        const titles = props.menuItems.reduce((acc, curr) => {
          if (!Object.prototype.hasOwnProperty.call(acc, curr.groupTitle)) {
            acc[curr.groupTitle] = true;
          }
          return acc;
        }, {});
        dropDownDispatch({
          type: actionTypes.SET_OPTION_GROUP_EXPANDED,
          payload: { optionGroupExpanded: titles },
        });
      }
    },
    [dropDownDispatch, props.menuItems, props.itemsType]
  );

  const setMouseInteraction = () => {
    dropDownDispatch({
      type: actionTypes.SET_INTERACTION_TYPE,
      payload: {
        interactionType: InteractionType.MOUSE,
      },
    });
  };

  const onMouseEnter = (index) => {
    dropDownDispatch({
      type: actionTypes.SET_HIGHLIGHTED_ITEM,
      payload: {
        keyCode: KeyCode.MOUSE_ENTER,
        items: props.menuItems,
        index: index,
      },
    });
  };

  const onMouseLeave = () => {
    dropDownDispatch({
      type: actionTypes.SET_HIGHLIGHTED_ITEM,
      payload: {
        keyCode: KeyCode.MOUSE_LEAVE,
        items: props.menuItems,
        index: -1,
      },
    });
  };

  return (
    <DropdownPopper
      isActive={dropDownState.active}
      referenceRef={containerRef.current}
      innerCtrCls={styles.menuPopperInnerCtr}
      ctrCls={styles.menuPopper}
      position={props.position}
      onClickOutside={() => {
        dropDownDispatch({
          type: actionTypes.HIDE_DROP_DOWN,
          payload: {
            menuItems: props.menuItems,
          },
        });
      }}
      boundaryRef={props.intersectionRef}
      canUsePortal={props.canUsePortal}
      maxHeight={props.maxHeight}
      isMenuWidthSameAsReference={props.isMenuWidthSameAsReference}
      referenceStrategy={props.popperReferenceStrategy}
    >
      <div
        ref={menuRef}
        className={`${styles.menu} ${
          props.itemsType === DropDownOptionTypes.GROUPED
            ? styles.groupedMenu
            : ""
        } ${!props.canShowScrollBar ? "no-scroll" : ""} ${
          props.isMulti ? styles.padded : ""
        } ${props.menuCtrCls}`}
      >
        {props.isMulti ? (
          <Multiple
            isSearchable={props.isSearchable}
            menuItems={props.menuItems}
            onChange={props.onChange}
            itemsType={props.itemsType}
            automationIdPrefix={props.automationIdPrefix}
            setMouseInteraction={setMouseInteraction}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ) : (
          <Single
            customOptionRenderer={props.customOptionRenderer}
            isSearchable={props.isSearchable}
            menuItems={props.menuItems}
            onChange={props.onChange}
            itemsType={props.itemsType}
            canShowTickIcon={props.canShowTickIcon}
            automationIdPrefix={props.automationIdPrefix}
            setMouseInteraction={setMouseInteraction}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </div>
    </DropdownPopper>
  );
}

Menu.propTypes = {
  customOptionRenderer: PropTypes.func,
  intersectionRef: PropTypes.any,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  itemsType: PropTypes.oneOf([
    DropDownOptionTypes.STANDARD,
    DropDownOptionTypes.GROUPED,
  ]),
  position: PropTypes.oneOf([DropDownPosition.BOTTOM, DropDownPosition.TOP]),
  value: PropTypes.any,
  canShowTickIcon: PropTypes.bool,
  canShowScrollBar: PropTypes.bool,
  automationIdPrefix: PropTypes.string,
  canUsePortal: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isMenuWidthSameAsReference: PropTypes.bool,
  menuCtrCls: PropTypes.string,
  popperReferenceStrategy: PropTypes.oneOf(
    Object.values(PopperReferenceStrategies)
  ),
};

export default Menu;
