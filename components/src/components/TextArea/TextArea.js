import { useEffect, useState } from "react";
import styles from "./TextArea.module.scss";
import PropTypes from "prop-types";
import { Label } from "../Label";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { forwardRef } from "react";
import { useRef } from "react";

const TextArea = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const textAreaRef = useRef();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Text Area");
    invariantUniqueId(props.uniqueId, "Text Area");
  }, [automationIdPrefix, props.uniqueId]);

  const [value, setValue] = useState(
    props.initialValue.slice(0, props.maxLength)
  );
  const [height, setHeight] = useState(props.minHeight);

  const onChange = (event) => {
    const textAreaValue = event.target.value;
    if (!event.target.value.trim()) {
      setHeight(props.minHeight);
    }
    setValue(textAreaValue);
    if (props.onChange) {
      props.onChange(textAreaValue);
    }
  };

  useEffect(() => {
    const elementRef = ref ? ref : textAreaRef;
    const element = elementRef?.current;
    if (elementRef?.current) {
      element.style.height = `${props.minHeight}px`;
      element.style.height = `${element.scrollHeight}px`;
      setHeight(element.scrollHeight);
    }
  }, [value, ref, props.minHeight]);

  useEffect(() => {
    setValue(props.initialValue.slice(0, props.maxLength));
  }, [props.initialValue, props.maxLength]);

  return (
    <div
      className={`${styles.textArea} ${props.ctrCls}`}
      role="region"
      aria-label={`${props.name} textarea`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-textarea`}
    >
      {props.title ? (
        <Label
          text={props.title}
          ctrCls={props.labelCtrCls}
          isRequired={props.isRequired}
          uniqueId={1667226006126}
        />
      ) : null}
      <div className={styles.lengthContainer}>
        <textarea
          ref={ref ? ref : textAreaRef}
          maxLength={props.maxLength}
          name={props.name}
          onChange={onChange}
          placeholder={props.placeholder}
          style={{
            height: `${height}px`,
            minHeight: `${props.minHeight}px`,
          }}
          value={value}
          className={`${props.maxLength ? styles.maxLength : ""} ${
            props.errorMessage ? styles.withError : ""
          }  ${props.isDisabled ? styles.isDisabled : ""}`}
          disabled={props.isDisabled}
        ></textarea>
        {props.maxLength ? (
          <div
            className={`${styles.lengthIndicator} ${
              props.isDisabled ? styles.isDisabled : ""
            }`}
          >
            <span className={styles.value}>{value.length}</span>
            <span>/</span>
            <span className={styles.maxLength}>{props.maxLength}</span>
          </div>
        ) : null}
      </div>
      {!!props.errorMessage && (
        <span className={styles.errorMessage}>{props.errorMessage}</span>
      )}
    </div>
  );
});

TextArea.displayName = "TextArea";

TextArea.propTypes = {
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * The initial value of the text area
   */
  initialValue: PropTypes.string,
  /**
   * ctrCls for the Label component
   */
  labelCtrCls: PropTypes.string,
  /**
   * Adds a asterisk to the label
   */
  isRequired: PropTypes.bool,
  /**
   * Determine if the TextField is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * The maximum length of the text area
   */
  maxLength: PropTypes.number,
  /**
   * Sets the name attribute of the textarea
   */
  name: PropTypes.string,
  /**
   * On change handler for the TextArea
   */
  onChange: PropTypes.func,
  /**
   * The placeholder text for the text area
   */
  placeholder: PropTypes.string,
  /**
   * The title of the text area
   */
  title: PropTypes.string,
  /**
   * The minimum height of the text area
   */
  minHeight: PropTypes.number,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * The error message to display
   */
  errorMessage: PropTypes.string,
};

TextArea.defaultProps = {
  ctrCls: "",
  initialValue: "",
  labelCtrCls: "",
  name: "",
  title: "",
  placeholder: "",
  isDisabled: false,
  minHeight: 90,
  errorMessage: undefined,
};

export default TextArea;
