import {
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import styles from "./InlineEdit.module.scss";
import { TextField } from "../TextField";
import { DropDownTicked, SearchCloseIcon } from "../../Icons";
import { InlineEditViewState } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const InlineEdit = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "InlineEdit");
    invariantUniqueId(props.uniqueId, "InlineEdit");
  }, [automationIdPrefix, props.uniqueId]);
  const [canShowInlineEdit, setCanShowInlineEdit] = useState(
    props.defaultViewState === InlineEditViewState.EditView
  );
  const [textValue, setTextValue] = useState(
    props.value.slice(0, props.maxLength)
  );
  const canSubmit = useCallback(() => {
    return props.canSubmit(textValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textValue]); //for memoizing the cansubmit function

  useImperativeHandle(ref, () => ({
    open: () => setCanShowInlineEdit(true),
    close: () => setCanShowInlineEdit(false),
  }));
  const onShowTextField = (e) => {
    if (props.isEditable && !canShowInlineEdit) {
      setValueToMaxLength();
      setCanShowInlineEdit(true);
    }
    e.stopPropagation();
  };
  const onCancel = (e) => {
    props.onCancel && props.onCancel(e, textValue);
    setValueToMaxLength();
    setCanShowInlineEdit(false);
  };
  const onValueChange = (e) => {
    props.onChange && props.onChange(e, e.target.value);
    setTextValue(e.target.value);
  };
  const onSubmit = (e) => {
    if (canSubmit()) {
      props.onSubmit(e, textValue);
      setCanShowInlineEdit(false);
    }
  };
  const setValueToMaxLength = () => {
    setTextValue(props.value.slice(0, props.maxLength));
  };
  const renderInputComponent = () => {
    return (
      <div
        className={`${styles.editContainer} ${
          canShowInlineEdit ? styles.showEditOption : ""
        } ${props.innerCtrCls}`}
        role="region"
      >
        <TextField
          ref={props.inputRef}
          onChange={onValueChange}
          value={textValue}
          title={""}
          label={""}
          minLength={props.minLength}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          errorMessage={!canSubmit() && props.errorMessage}
          uniqueId={1669188457878}
        />
        <DropDownTicked
          isDisabled={textValue.length === 0 || !canSubmit()}
          onClick={onSubmit}
          className={`${styles.tickIcon} squared`}
          uniqueId={1669186574203}
        />
        <SearchCloseIcon
          className={`${styles.cancelIcon} squared`}
          onClick={onCancel}
          uniqueId={1669186585592}
        />
      </div>
    );
  };

  return (
    <div
      className={`${styles.inlineEdit} ${
        canShowInlineEdit ? styles.inlineEditActive : ""
      } ${!props.isEditable ? "" : styles.isEnabled} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-inline-edit`}
      onClick={onShowTextField}
    >
      <span
        className={
          canShowInlineEdit
            ? styles.inlineEditActiveLabel
            : props.labelCtrCls ?? styles.label
        }
        onClick={onShowTextField}
      >
        {textValue}
      </span>
      {renderInputComponent()}
    </div>
  );
});

InlineEdit.displayName = "InlineEdit";

InlineEdit.propTypes = {
  /**
   * Text value of the InlineEdit
   */
  value: PropTypes.string,
  /**
   * Max length for the input
   */
  maxLength: PropTypes.number,
  /**
   * Container class for the InlineEdit
   */
  ctrCls: PropTypes.string,
  /**
   * Container class for the edit container
   */
  innerCtrCls: PropTypes.string,
  /**
   * Container class for the label container
   */
  labelCtrCls: PropTypes.string,
  /**
   * Specific whether InlineEdit is editable
   */
  isEditable: PropTypes.bool,
  /**
   * Error message to show at the bottom similar to TextField
   */
  errorMessage: PropTypes.string,
  /**
   * Placeholder text of the InlineEdit
   */
  placeholder: PropTypes.string,
  /**
   * Access to the input component
   */
  inputRef: PropTypes.any,
  /**
   * Triggered when typed on input
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Triggered when submit button is pressed
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Triggered when cancel button is clicked
   */
  onCancel: PropTypes.func,
  /**
   * Validator function to enable submit button
   */
  canSubmit: PropTypes.func,
  minLength: PropTypes.number,
  /**
   * Specifies the Default View State for the InlineEdit
   */
  defaultViewState: PropTypes.oneOf([
    InlineEditViewState.DisplayView,
    InlineEditViewState.EditView,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

InlineEdit.defaultProps = {
  value: "",
  ctrCls: "",
  innerCtrCls: "",
  isEditable: true,
  errorMessage: "",
  placeholder: "",
  inputRef: undefined,
  onCancel: () => undefined,
  minLength: 0,
  defaultViewState: InlineEditViewState.DisplayView,
  canSubmit: (textValue) => textValue.length > 0,
};

export default InlineEdit;
