import { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Menu.module.scss";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { Popper } from "../Popper";
import { SimpleMenuPositions } from "../../Enums";

const Menu = ({
  items,
  onItemClick,
  isVisible,
  onChangeVisibility,
  ctrCls,
  referenceRef,
  uniqueId,
  canUsePortal,
  position,
  popperCtrCls,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Menu");
    invariantUniqueId(uniqueId, "Menu");
  }, [automationIdPrefix, uniqueId]);

  const onClick = (item) => {
    onItemClick(item);
    onChangeVisibility(false);
  };

  const modifiers = useMemo(
    () => [
      {
        name: "offset",
        options: {
          offset: [0, 5],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top-end", "top-start", "bottom-start"],
        },
      },
      {
        name: "minSameWidth",
        enabled: true,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: ({ state }) => {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          state.elements.popper.style.minWidth = `${state.elements.reference.offsetWidth}px`;
        },
      },
    ],
    []
  );

  return (
    <Popper
      isVisible={isVisible}
      placement={position}
      isPortal={canUsePortal}
      modifiers={modifiers}
      referenceElement={referenceRef}
      onClickOutside={() => {
        onChangeVisibility(false);
      }}
      innerCtrCls={`${styles.menu} ${ctrCls}`}
      ctrCls={`${styles.popper} ${popperCtrCls}`}
    >
      <div data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-menu`}>
        <ul
          className={styles.list}
          onClick={(event) => event.stopPropagation()}
        >
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => onClick(item)}
              title={item.label}
              data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-${item.value}-menuitem-menu`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </Popper>
  );
};

Menu.propTypes = {
  /**
   * Array of items to be displayed in the menu
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      onClick: PropTypes.func,
    })
  ),
  /**
   * Callback function to be called when an item is clicked
   */
  onItemClick: PropTypes.func,
  /**
   * Callback function to be called when the menu visibility changes
   */
  onChangeVisibility: PropTypes.func,
  /**
   * Whether the menu is visible or not
   */
  isVisible: PropTypes.bool,
  /**
   * Class name to be applied to the menu container
   */
  ctrCls: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Reference to the element that the menu should be positioned relative to
   */
  referenceRef: PropTypes.object,
  /**
   * Whether the menu should be rendered in a portal or not
   * Requires DisprzPortalDomProvider
   */
  canUsePortal: PropTypes.bool,
  /**
   * Class name to be applied to the popper container
   */
  popperCtrCls: PropTypes.string,
  /**
   * Position of the menu relative to the reference element
   */
  position: PropTypes.oneOf(Object.values(SimpleMenuPositions)),
};

/* istanbul ignore next */
Menu.defaultProps = {
  items: [],
  onItemClick: () => undefined,
  ctrCls: "",
  menuCtrCls: "",
  canUsePortal: false,
  popperCtrCls: "",
  position: SimpleMenuPositions.BOTTOM_END,
};

export default Menu;
