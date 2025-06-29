import styles from "./Label.module.scss";
import PropTypes from "prop-types";
import { InfoIcon } from "../../Icons";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
function Label(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Label");
    invariantUniqueId(props.uniqueId, "Label");
  }, [automationIdPrefix, props.uniqueId]);

  return (
    <div
      className={`${styles.label} ${props.ctrCls}`}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-label`}
    >
      <span className={styles.text}>{props.text}</span>
      {props.isRequired ? (
        <span className={styles.asterisk} role="suggestion">
          *
        </span>
      ) : null}
      {props.helpText && (
        <span className={`${styles.iconContainer}`} title={props.helpText}>
          <InfoIcon className="no-hover cursor-default" />
        </span>
      )}
    </div>
  );
}

Label.defaultProps = {
  ctrCls: "",
  isRequired: false,
  text: "",
  helpText: "",
};

Label.propTypes = {
  /**
   * Container class for the component
   */
  ctrCls: PropTypes.string,
  /**
   * Adds a asterisk to the label
   */
  isRequired: PropTypes.bool,
  /**
   * The text of the label
   */
  text: PropTypes.string,
  /**
   * Descriptive text displayed with an 'i' icon.
   */
  helpText: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default Label;
