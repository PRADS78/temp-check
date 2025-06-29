import { forwardRef, useEffect } from "react";
import styles from "./TextField.module.scss";
import PropTypes from "prop-types";
import { Standard } from "./Standard";
import { Keyword } from "./Keyword";
import { TextFieldTypes } from "../../Enums";
import { Label } from "../Label";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const TextField = forwardRef(function (props, ref) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "TextField");
    invariantUniqueId(props.uniqueId, "TextField");
  }, [automationIdPrefix, props.uniqueId]);

  const textFieldClass = `${styles.textField} ${
    props.isDisabled ? styles.isDisabled : ""
  } ${props.ctrCls}
  `;

  return (
    <div
      className={textFieldClass}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-text-field`}
      onClick={(e) => e.stopPropagation()}
    >
      {props.title ? (
        <Label
          text={props.title}
          ctrCls={props.labelCtrCls}
          isRequired={props.isRequired}
          uniqueId={1667226308028}
        />
      ) : null}
      {props.type === TextFieldTypes.KEYWORD ? (
        <Keyword
          isDisabled={props.isDisabled}
          label={props.label}
          name={props.name}
          onChange={props.onChange}
          placeholder={props.placeholder}
          textFieldClass={styles.textField}
          title={props.title}
          value={props.value}
        />
      ) : (
        <Standard
          borderGapColor={props.borderGapColor}
          isDisabled={props.isDisabled}
          label={props.label}
          max={
            props.type === TextFieldTypes.NUMBER ||
            props.type === TextFieldTypes.DECIMAL_NUMBER
              ? props.max
              : undefined
          }
          maxLength={props.maxLength}
          min={
            props.type === TextFieldTypes.NUMBER ||
            props.type === TextFieldTypes.DECIMAL_NUMBER
              ? props.min
              : undefined
          }
          minLength={props.minLength}
          name={props.name}
          onChange={props.onChange}
          placeholder={props.placeholder}
          ref={ref}
          required={props.required}
          title={props.title}
          type={props.type}
          value={props.value}
          helpText={props.helpText}
          errorMessage={props.errorMessage}
          onInvalidNumberInput={props.onInvalidNumberInput}
        />
      )}
    </div>
  );
});

TextField.displayName = "TextField";

TextField.propTypes = {
  /**
   * specifies the top border's gap color when the input is focused
   */
  borderGapColor: PropTypes.string.isRequired,
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * On change handler for the TextField
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Placeholder text for the TextField
   */
  placeholder: PropTypes.string,
  /**
   * Type of the TextField
   */
  type: PropTypes.oneOf([
    TextFieldTypes.TEXT,
    TextFieldTypes.PASSWORD,
    TextFieldTypes.EMAIL,
    TextFieldTypes.NUMBER,
    TextFieldTypes.DECIMAL_NUMBER,
    TextFieldTypes.KEYWORD,
  ]),
  /**
   * Set the name attribute of the input
   */
  name: PropTypes.string,
  /**
   * Specify the label for the TextField
   */
  label: PropTypes.string,
  /**
   * Determine if the TextField is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * Specify help text for the TextField
   */
  helpText: PropTypes.string,
  /**
   * Value of the TextField
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Determine if the TextField is required
   */
  required: PropTypes.bool,
  /**
   * Error message for the TextField
   */
  errorMessage: PropTypes.string,
  /**
   * ctrCls for the Label component
   */
  labelCtrCls: PropTypes.string,
  /**
   * Adds a asterisk to the label
   */
  isRequired: PropTypes.bool,
  /**
   * Minimum length of the TextField
   */
  minLength: PropTypes.number,
  /**
   * Maximum length of the TextField
   */
  maxLength: PropTypes.number,
  /**
   * Minimum value of the TextField
   */
  min: PropTypes.number,
  /**
   * Maximum value of the TextField
   */
  max: PropTypes.number,
  /**
   * Title of the TextField shows at the top
   */
  title: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Callback function when the input is invalid for number type
   */
  onInvalidNumberInput: PropTypes.func,
};

/* istanbul ignore next */
TextField.defaultProps = {
  borderGapColor: "transparent",
  ctrCls: "",
  type: TextFieldTypes.TEXT,
  name: "text-field",
  label: "",
  isDisabled: false,
  helpText: null,
  value: "",
  required: true,
  errorMessage: null,
  title: null,
  labelCtrCls: "",
  placeholder: "",
  onInvalidNumberInput: () => undefined,
};

export default TextField;
