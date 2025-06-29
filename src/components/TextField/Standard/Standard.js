import PropTypes from "prop-types";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextFieldTypes } from "../../../Enums";
import { VisibilityIcon, VisibilityOffIcon } from "../../../Icons";
import styles from "./Standard.module.scss";

const Standard = forwardRef(function (props, ref) {
  const [calculatedGapWidth, setCalculatedGapWidth] = useState("0");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const localRef = useRef();
  const [minMaxLocalErrorMessage, setMinMaxLocalErrorMessage] = useState("");
  const [localNumberInputValue, setLocalNumberInputValue] = useState(
    props.value
  );

  useEffect(() => {
    const inputRef = ref ? ref.current ?? ref : localRef.current;
    /* istanbul ignore else */
    if (inputRef && props.type == TextFieldTypes.NUMBER) {
      const onFocus = () => {
        inputRef.select();
      };
      inputRef.addEventListener("focus", onFocus);
      return () => {
        inputRef.removeEventListener("focus", onFocus);
      };
    }
  }, [props.type, ref]);

  const renderVisibilityIcon = useCallback(() => {
    const onClickPasswordVisibility = (event) => {
      setPasswordVisible(!passwordVisible);
      event.preventDefault();
    };
    return passwordVisible ? (
      <VisibilityOffIcon
        onClick={onClickPasswordVisibility}
        className={styles.textVisibility}
        isDisabled={props.isDisabled}
        uniqueId={1667890842390}
      />
    ) : (
      <VisibilityIcon
        onClick={onClickPasswordVisibility}
        className={styles.textVisibility}
        isDisabled={props.isDisabled}
        uniqueId={1667890850678}
      />
    );
  }, [passwordVisible, props.isDisabled]);

  const renderMaxLengthCounter = () => {
    return (
      <div className={styles.lengthIndicator}>
        <span className={styles.value}>{props.value.length}</span>
        <span className={styles.maxLength}>/{props.maxLength}</span>
      </div>
    );
  };

  const labelRef = useCallback(
    (node) => {
      if (node && props.label) {
        let labelWidth;
        if (props.value.length <= 0) {
          labelWidth = node.getBoundingClientRect().width * (12 / 14); //calculating the shrinking width of the label with the font size of 12 by 14 multi by actual width
        } else {
          labelWidth = node.getBoundingClientRect().width;
        }
        labelWidth = labelWidth + 3; //add 3 for empty space
        setCalculatedGapWidth(labelWidth + "px");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.label]
  );

  const onChange = (event) => {
    let inputValue = event.target.value;
    if (
      props.type == TextFieldTypes.NUMBER ||
      props.type == TextFieldTypes.DECIMAL_NUMBER
    ) {
      /* istanbul ignore else */
      if (canShowErrorMessage(event)) {
        onErrorMessage(event);
        return;
      }
      setMinMaxLocalErrorMessage("");
      if (props.type === TextFieldTypes.DECIMAL_NUMBER) {
        props.onChange(event, parseFloat(Number(inputValue), 10));
      } else {
        props.onChange(event, parseInt(Number(inputValue), 10));
      }
    } else {
      if (props.maxLength && inputValue.length > props.maxLength) {
        return;
      }
      props.onChange(event, inputValue);
    }
  };

  const canShowErrorMessage = (e) => {
    return (
      e.target.value < props.min ||
      e.target.value > props.max ||
      isNaN(e.target.valueAsNumber)
    );
  };

  const onErrorMessage = (e) => {
    /* istanbul ignore if */
    if (isNaN(e.target.valueAsNumber)) {
      /* istanbul ignore next */
      setMinMaxLocalErrorMessage("Invalid number");
    } else {
      setMinMaxLocalErrorMessage(
        `Max range is ${props.max} and min range is ${props.min}`
      );
    }
    setLocalNumberInputValue(e.target.value);
    props.onInvalidNumberInput(e, e.target.value, {
      min: props.min,
      max: props.max,
    });
  };

  const onInputFocus = () => {
    setIsInputFocused(true);
  };

  const onInputBlur = () => {
    setIsInputFocused(false);
  };

  const assistiveText = useMemo(() => {
    if (props.errorMessage || minMaxLocalErrorMessage) {
      return (
        <div className={`${styles.errorMessage} isError`}>
          {props.errorMessage ?? minMaxLocalErrorMessage}
        </div>
      );
    } else {
      return props.helpText && isInputFocused ? (
        <div className={styles.helpText}>{props.helpText}</div>
      ) : null;
    }
  }, [
    props.errorMessage,
    props.helpText,
    minMaxLocalErrorMessage,
    isInputFocused,
  ]);

  const _getValue = () => {
    if (
      props.type === TextFieldTypes.NUMBER ||
      props.type === TextFieldTypes.DECIMAL_NUMBER
    ) {
      if (props.errorMessage || minMaxLocalErrorMessage) {
        return localNumberInputValue;
      }
    }
    return props.value;
  };

  return (
    <>
      <label
        className={`${styles.standard} ${
          props.isDisabled ? styles.isDisabled : ""
        } ${props.type === TextFieldTypes.PASSWORD ? styles.isTextKey : ""}`}
      >
        <input
          ref={ref ?? localRef}
          disabled={props.isDisabled}
          name={props.name}
          onBlur={onInputBlur}
          onChange={onChange}
          onFocus={onInputFocus}
          placeholder={props.label ? "" : props.placeholder}
          type={
            props.type == TextFieldTypes.PASSWORD
              ? passwordVisible
                ? TextFieldTypes.TEXT
                : TextFieldTypes.PASSWORD
              : props.type === TextFieldTypes.NUMBER ||
                props.type === TextFieldTypes.DECIMAL_NUMBER
              ? TextFieldTypes.NUMBER
              : props.type
          }
          value={_getValue()}
          required={props.required}
          minLength={props.minLength}
          maxLength={props.maxLength}
          min={props.min}
          max={props.max}
          role="textbox"
        />

        {props.title ? null : (
          <>
            <div
              className={`${styles.topBorder} `}
              style={{
                backgroundColor: props.borderGapColor,
                gap: isInputFocused ? calculatedGapWidth : "0",
              }}
            >
              <div className={styles.anteGap}></div>
              <div className={styles.postGap}></div>
            </div>
            <span
              ref={labelRef}
              className={`${styles.textFieldLabel} ${
                !isInputFocused && props.value.length !== 0
                  ? styles.textFieldLabelDisabled
                  : ""
              }`}
            >
              {props.label}
            </span>
          </>
        )}

        {props.type === TextFieldTypes.PASSWORD ? renderVisibilityIcon() : null}
        {props.maxLength ? renderMaxLengthCounter() : null}
      </label>
      <div className={styles.assistiveText}>{assistiveText}</div>
    </>
  );
});

Standard.displayName = "Standard";

Standard.propTypes = {
  // specifies the top border's gap color when the input is focused
  borderGapColor: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  minLength: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.oneOf([
    TextFieldTypes.TEXT,
    TextFieldTypes.PASSWORD,
    TextFieldTypes.EMAIL,
    TextFieldTypes.NUMBER,
    TextFieldTypes.DECIMAL_NUMBER,
    TextFieldTypes.KEYWORD,
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.string,
  errorMessage: PropTypes.string,
  onInvalidNumberInput: PropTypes.func,
};

export default Standard;
