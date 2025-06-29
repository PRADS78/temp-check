import { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./ToggleSwitch.module.scss";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

function ToggleSwitchItem({
  isActive,
  item,
  onChange,
  onSetRef,
  isDisabled,
  resizeObserver,
  itemRef,
  uniqueId,
}) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "ToggleSwitch");
    invariantUniqueId(uniqueId, "ToggleSwitch");
  }, [automationIdPrefix, uniqueId]);

  useEffect(() => {
    /* istanbul ignore else */
    if (itemRef[item.id]) {
      resizeObserver.observe(itemRef[item.id]);
    }
    return () => {
      /* istanbul ignore else */
      if (itemRef[item.id]) {
        resizeObserver.unobserve(itemRef[item.id]);
      }
    };
  }, [item.id, resizeObserver, itemRef]);

  const _onChange = (e) => {
    if (!isDisabled) {
      onChange(e, item);
    }
  };

  const _onSetRef = useCallback(
    (ref) => {
      onSetRef(ref, item);
    },
    [item, onSetRef]
  );

  return (
    <li
      className={`${styles.toggleItemContainer} ${
        isActive ? styles.active : ""
      } ${isDisabled ? styles.disabled : ""}`}
      onClick={_onChange}
      role="tab"
      ref={_onSetRef}
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-toggle-switch-item`}
    >
      <span className={styles.label}>{item.label}</span>
    </li>
  );
}

ToggleSwitchItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSetRef: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  resizeObserver: PropTypes.object.isRequired,
  itemRef: PropTypes.object.isRequired,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default ToggleSwitchItem;
