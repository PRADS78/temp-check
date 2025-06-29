import styles from "./Switch.module.scss";
import PropTypes from "prop-types";
import { Ripple } from "./Ripple";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

function Switch(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Switch");
    invariantUniqueId(props.uniqueId, "Switch");
  }, [automationIdPrefix, props.uniqueId]);

  return (
    <label
      className={`${styles.switch} ${props.ctrCls} ${
        props.disabled ? styles.disabled : ""
      }`}
      role="switch"
      aria-checked={props.on}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-switch`}
    >
      <input
        checked={props.on}
        disabled={props.disabled}
        name={props.name}
        onChange={(event) => props.onChange(event, props.on)}
        type="checkbox"
      />
      <span className={styles.background}></span>
      <span className={styles.sphere}>
        {props.disabled ? null : <Ripple />}
      </span>
    </label>
  );
}

Switch.propTypes = {
  /**
   * Determine if the switch is on or off
   */
  on: PropTypes.bool,
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * Determines the "disabled" attribute of the button
   */
  disabled: PropTypes.bool,
  /**
   * Sets the name attribute of the input
   */
  name: PropTypes.string,
  /**
   * On change handler for the Switch
   */
  onChange: PropTypes.func.isRequired,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Switch.defaultProps = {
  on: false,
  ctrCls: "",
  disabled: false,
  name: "toggle",
};

export default Switch;
