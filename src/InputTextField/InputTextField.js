import { createRef, useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import "./InputTextField.scss";
import { InputBoxtypes } from "../Enums";

/**
 * @deprecated
 */
const InputTextField = forwardRef((props, ref) => {
  const { type, value, onChange = () => {} } = props;
  const [inputType, setInputType] = useState(type);
  const [textValue, setTextValue] = useState(value);
  const inputRefEle = createRef(null);
  const handleClickView = () => {
    setInputType(
      inputType === InputBoxtypes.TEXT
        ? InputBoxtypes.PASSWORD
        : InputBoxtypes.TEXT
    );
  };
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRefEle && inputRefEle.current) {
        inputRefEle.current.focus();
      }
    },
  }));

  const getInput = () => {
    return inputRefEle;
  };
  const handleChange = (e) => {
    setTextValue(e.target.value);
    onChange(e.target.value, e);
  };

  return (
    <>
      <div
        className={
          " form-item " +
          (props.errorMessage ? " error " : " ") +
          (props.disabled ? " disabled " : " ") +
          props.ctrCls
        }
      >
        <input
          type={inputType}
          id={props.name}
          name={props.name}
          ref={inputRefEle}
          required={props.required}
          disabled={props.disabled}
          // onChange={(e) => props.onChange(e)}
          onChange={handleChange}
          value={textValue}
          minLength={inputType !== "number" ? props.minLength : undefined}
          maxLength={inputType !== "number" ? props.maxLength : undefined}
          min={inputType === "number" ? props.min : undefined}
          max={inputType === "number" ? props.max : undefined}
        />
        <label htmlFor={props.name}>{props.label}</label>
        {type === InputBoxtypes.PASSWORD && (
          <div className="textbox-btn" onClick={handleClickView}>
            <svg className="app-icon">
              <use xlinkHref={`#icon-eye`} />
            </svg>
          </div>
        )}
        {props.errorMessage ? (
          <span className="error-text">{props.errorMessage}</span>
        ) : (
          <span className="help-text">{props.helpText}</span>
        )}
      </div>
    </>
  );
});

InputTextField.displayName = "InputTextField";

InputTextField.propTypes = {
  /**
   * Specify ctrCls for the radio group class name
   */
  ctrCls: PropTypes.string,
  /**
   * OnChange is a function that provides the textbox value on change action performs
   */
  onChange: PropTypes.func,
  /**
   * Specify type for the text box
   */
  type: PropTypes.oneOf(["text", "password", "email", "number"]),
  /**
   * Specify name for the text box
   */
  name: PropTypes.string,
  /**
   * Specify label for the text box
   */
  label: PropTypes.string,
  /**
   * define disable state for the text box
   */
  disabled: PropTypes.bool,
  /**
   * Specify help text for the text box
   */
  helpText: PropTypes.string,
  /**
   * store value while onchange text box
   */
  value: PropTypes.string,
  /**
   * define required state for the text box
   */
  required: PropTypes.bool,
  /**
   * Specify error message for the text box
   */
  errorMessage: PropTypes.string,
  /**
   * Specify min characters for the text box
   */
  minLength: PropTypes.number,
  /**
   * Specify max characters for the text box
   */
  maxLength: PropTypes.number,
  /**
   * Specify min characters for the text box
   */
  min: PropTypes.number,
  /**
   * Specify max characters for the text box
   */
  max: PropTypes.number,
};

InputTextField.defaultProps = {
  ctrCls: "",
  type: InputBoxtypes.TEXT,
  name: "textbox",
  label: "Label",
  disabled: false,
  helpText: "",
  value: "",
  required: true,
  errorMessage: "",
  onChange: () => {},
};

export default InputTextField;
