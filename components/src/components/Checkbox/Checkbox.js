import styles from "./Checkbox.module.scss";
import PropTypes from "prop-types";
import { CheckboxTicked } from "../../Icons";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

function Checkbox(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Checkbox");
    invariantUniqueId(props.uniqueId, "Checkbox");
  }, [automationIdPrefix, props.uniqueId]);

  useEffect(() => {
    if (props.disabled) {
      console.warn(
        "Checkbox: 'disabled' prop is deprecated. Use 'isDisabled' instead."
      );
    }
  }, [props.disabled]);

  return (
    <label
      className={`${styles.checkbox} ${props.ctrCls} ${
        props.disabled || props.isDisabled ? styles.disabled : styles.enabled
      }`}
      role="region"
      aria-roledescription="checkboxcontainer"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-checkbox`}
    >
      <input
        disabled={props.disabled || props.isDisabled}
        onChange={(e) => props.onChange(e, props.isChecked)}
        checked={props.isChecked}
        name={props.inputName}
        type="checkbox"
      />
      <div className={styles.box}>
        <CheckboxTicked className={`${styles.tickedIcon}  no-hover`} />
        <div className={styles.hoverBackgroundChange}></div>
      </div>

      {props.label ? <span className={styles.text}>{props.label}</span> : null}
    </label>
  );
}

Checkbox.propTypes = {
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * Determines the "disabled" attribute of the button
   */
  isDisabled: PropTypes.bool,
  /**
   * Determines the "disabled" attribute of the button - **DEPRECATED**
   * @deprecated use isDisabled instead
   */
  disabled: PropTypes.bool,
  /**
   * Sets the name attribute of the input
   */
  inputName: PropTypes.string,
  /**
   * Sets the label for the checkbox
   */
  label: PropTypes.string,
  /**
   * On change handler for the checkbox
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Determines if the checkbox is checked
   */
  isChecked: PropTypes.bool,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Checkbox.defaultProps = {
  ctrCls: "",
  inputName: "checkbox",
  isChecked: false,
  disabled: false,
  label: "",
};

export default Checkbox;
