import PropTypes from "prop-types";
import styles from "./ToggleSwitch.module.scss";
import { ToggleSwitchSize } from "../../Enums/index";
import { useCallback, useLayoutEffect, useState } from "react";
import ToggleSwitchItem from "./ToggleSwitchItem";
import { useMemo, useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import {
  invariantAutomationPrefixId,
  invariantUniqueId,
  isRTL,
} from "../../Utils";

function ToggleSwitch({
  items,
  selectedId,
  onChange,
  ctrCls,
  size,
  isDisabled,
  uniqueId,
}) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "ToggleSwitch");
    invariantUniqueId(uniqueId, "ToggleSwitch");
  }, [automationIdPrefix, uniqueId]);

  const [currentWidth, setCurrentWidth] = useState(0);
  const [itemsRef, setItemsRef] = useState({});

  const resizeObserver = useMemo(() => {
    // Creating a observer to observe the width as it is
    // incorrect sometimes when using the clientWidth
    return new ResizeObserver((entries) => {
      // As the width is constant for all elements. We're just observing the first element.
      console.log("entries", entries);
      const firstElement = entries[0];
      /* istanbul ignore else */
      if (firstElement) {
        const borderBoxWidth = firstElement.borderBoxSize[0].inlineSize;
        setCurrentWidth(borderBoxWidth);
      }
    });
  }, []);

  useLayoutEffect(() => {
    /* istanbul ignore else */
    if (itemsRef[selectedId]) {
      setCurrentWidth(itemsRef[selectedId].clientWidth);
    }
  }, [selectedId, itemsRef]);

  const getTranslateX = useCallback(() => {
    let translateX = 0;
    const selectedIndex = items.findIndex((item) => item.id === selectedId);
    /* istanbul ignore else */
    if (itemsRef[selectedId]) {
      translateX = (itemsRef[selectedId].clientWidth + 4) * selectedIndex;
    }
    return isRTL() ? -translateX : translateX;
  }, [items, selectedId, itemsRef]);

  const onSetRef = useCallback(
    (ref, item) => {
      if (ref) {
        setItemsRef((prevTogglesRef) => {
          prevTogglesRef[item.id] = ref;
          return prevTogglesRef;
        });
      }
    },
    [setItemsRef]
  );

  return (
    <ul
      className={`${styles.toggleSwitchContainer} ${
        size === ToggleSwitchSize.SMALL ? styles.small : ""
      } ${ctrCls}`}
      role="tablist"
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-toggle-switch`}
    >
      {items.map((item) => {
        const isActive = selectedId === item.id;
        return (
          <ToggleSwitchItem
            isActive={isActive}
            key={item.id}
            item={item}
            onSetRef={onSetRef}
            onChange={onChange}
            isDisabled={isDisabled || item.isDisabled}
            resizeObserver={resizeObserver}
            itemRef={itemsRef}
            uniqueId={`${1677752388928}-${item.id}`}
          />
        );
      })}
      {currentWidth > 0 && !isDisabled && (
        <div
          className={`${styles.selectedState}`}
          style={{
            width: `${currentWidth}px`,
            transform: `translateX(${getTranslateX()}px)`,
          }}
        />
      )}
    </ul>
  );
}

ToggleSwitch.propTypes = {
  /**
   * Array of items to be displayed in the toggle switch
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ).isRequired,
  /**
   * Id of the selected item
   */
  selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Callback function to be called when the selected item changes
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Additional class to be added to the container
   */
  ctrCls: PropTypes.string,
  /**
   * Size of the toggle switch
   */
  size: PropTypes.oneOf([ToggleSwitchSize.REGULAR, ToggleSwitchSize.SMALL]),
  /**
   * Whether the toggle switch is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

ToggleSwitch.defaultProps = {
  ctrCls: "",
  isDisabled: false,
  size: ToggleSwitchSize.REGULAR,
};

export default ToggleSwitch;
