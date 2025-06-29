import { useEffect } from "react";
import styles from "./RadioButton.module.scss";
import PropTypes from "prop-types";
import { RadioButtonOrientation } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

function RadioButton(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "RadioButton");
    invariantUniqueId(props.uniqueId, "RadioButton");
  }, [automationIdPrefix, props.uniqueId]);

  const { onChange } = props;

  const renderOptions = () => {
    return props.groups.map((el) => {
      return (
        <label
          key={el.id}
          className={`${
            props.isDisabled || el.isDisabled ? styles.radioDisabled : ""
          }`}
          htmlFor={el.id}
          data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-${el.id}-radio-button`}
        >
          <input
            checked={el.id === props.selectedGroupId}
            disabled={props.isDisabled || el.isDisabled}
            id={el.id}
            name={el.name}
            onChange={(event) => onChange(event, el)}
            type="radio"
            value={el.value ?? el.id}
          />
          <div className={styles.radioSphereSection}>
            <div className={styles.radioSphere}></div>
          </div>
          <span className={styles.radioLabel}>{el.label}</span>
          {typeof el.additionalEle === "function"
            ? el.additionalEle()
            : el.additionalEle}
        </label>
      );
    });
  };

  return (
    <div
      className={`${styles.radioButton} ${props.ctrCls} ${
        styles[props.orientation]
      }`}
      role="radiogroup"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-radio-button`}
    >
      {renderOptions()}
    </div>
  );
}

RadioButton.propTypes = {
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * Determines the "disabled" attribute of the button
   */
  isDisabled: PropTypes.bool,
  /**
   * Determines the selected value in the group
   */
  selectedGroupId: PropTypes.string,
  /**
   * An array of objects whose data will be used for every radio input
   * **name** must be the same and **id** must be unique
   *
   * **Sample Data**
   *
   * ```js
   * [
   *  {
   *    label: "Mango",
   *    name: "flavor",
   *    id: "mango",
   *    value: "Mango",
   *    isDisabled: false
   *  }
   * ]
   * ```
   */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      additionalEle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      name: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isDisabled: PropTypes.bool,
    })
  ),
  /**
   * On change handler for the radio button
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Determines the orientation of the radio button
   */
  orientation: PropTypes.oneOf([
    RadioButtonOrientation.horizontal,
    RadioButtonOrientation.vertical,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

RadioButton.defaultProps = {
  ctrCls: "",
  isDisabled: false,
  onChange: () => undefined,
  orientation: RadioButtonOrientation.vertical,
};

export default RadioButton;
