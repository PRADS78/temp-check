import { useMemo, useEffect } from "react";
import styles from "./DialogBox.module.scss";
import PropTypes from "prop-types";
import { SearchCloseIcon } from "../../Icons";
import { OutlinedButton, PrimaryButton } from "../AppButton";
import { RingLoader } from "./RingLoader";
import { CSSTransition } from "react-transition-group";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
function DialogBox(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "DialogBox");
    invariantUniqueId(props.uniqueId, "DialogBox");
  }, [automationIdPrefix, props.uniqueId]);

  const renderHeaderCloseButton = useMemo(() => {
    return props.canShowHeaderCloseButton ? (
      <SearchCloseIcon
        className={`${styles.closeButton} no-hover`}
        onClick={props.onDismissDialogBox}
        role="dismissdialog"
        uniqueId={1666939242025}
      />
    ) : null;
  }, [props.canShowHeaderCloseButton, props.onDismissDialogBox]);

  const renderCloseButton = useMemo(() => {
    return props.canShowCloseButton ? (
      <OutlinedButton
        label={props.closeButtonLabel}
        onClick={props.onCloseButtonClick}
        uniqueId={1666939231228}
        isDisabled={props.isDisabledCancelButton}
      />
    ) : null;
  }, [
    props.canShowCloseButton,
    props.closeButtonLabel,
    props.onCloseButtonClick,
    props.isDisabledCancelButton,
  ]);

  const renderOkButton = useMemo(() => {
    return props.canShowOkButton ? (
      props.isLoading ? (
        <button className={styles.loadingButton} role="status" aria-busy="true">
          <RingLoader />
        </button>
      ) : (
        <PrimaryButton
          label={props.okButtonLabel}
          onClick={props.onOkButtonClick}
          uniqueId={1666939257346}
          isDisabled={props.isDisabledOkButton}
        />
      )
    ) : null;
  }, [
    props.canShowOkButton,
    props.isLoading,
    props.okButtonLabel,
    props.onOkButtonClick,
    props.isDisabledOkButton,
  ]);

  return (
    <CSSTransition
      in={props.isVisible}
      timeout={300}
      classNames={{
        enter: styles.dialogEnter,
        enterActive: styles.dialogEnterActive,
        enterDone: styles.dialogEnterDone,
        exit: styles.dialogExit,
        exitActive: styles.dialogExitActive,
        exitDone: styles.dialogExitDone,
      }}
      unmountOnExit
    >
      <div
        className={`${styles.dialogBox} ${props.ctrCls}`}
        role="dialog"
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-dialog-box`}
      >
        <div
          onClick={
            props.isDismissable ? props.onDismissDialogBox : () => undefined
          }
          className={styles.overlay}
        ></div>
        <div className={styles.component}>
          {props.title ? (
            <div className={styles.title}>{props.title}</div>
          ) : null}
          {renderHeaderCloseButton}
          <div className={`${styles.body} ${props.bodyCtrCls}`}>
            {props.content}
            {props.children}
          </div>
          <div className={styles.actionButtons}>
            {props.actionButtons}
            {renderCloseButton}
            {renderOkButton}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

DialogBox.defaultProps = {
  bodyCtrCls: "",
  ctrCls: "",
  content: null,
  canShowCloseButton: true,
  canShowHeaderCloseButton: true,
  canShowOkButton: true,
  okButtonLabel: "Ok",
  closeButtonLabel: "Cancel",
  actionButtons: [],
  onCloseButtonClick: () => undefined,
  onOkButtonClick: () => undefined,
  isVisible: false,
  onDismissDialogBox: () => undefined,
  title: null,
  isLoading: false,
  isDismissable: false,
  isDisabledOkButton: false,
  isDisabledCancelButton: false,
};

DialogBox.propTypes = {
  /**
   * Body custom class for customization
   */
  bodyCtrCls: PropTypes.string,
  /**
   * The custom class for the Dialog box
   */
  ctrCls: PropTypes.string,
  // enable the close button at the bottom of the Dialog box
  /**
   * The content for the dialog box's body
   */
  content: PropTypes.string,
  /**
   * Enables the close button at the bottom of the Dialog box
   */
  canShowCloseButton: PropTypes.bool,
  /**
   * Enable the button adjacent to the title that closes the dialog box;
   */
  canShowHeaderCloseButton: PropTypes.bool,
  /**
   * Enable the ok button located at the bottom
   */
  canShowOkButton: PropTypes.bool,
  /**
   * Specify okButtonLabel for the DialogControl submit button string value
   */
  okButtonLabel: PropTypes.any,
  /**
   * Specify the label for the close button
   */
  closeButtonLabel: PropTypes.string,
  /**
   * Additional action buttons at the bottom of the Dialog box
   */
  actionButtons: PropTypes.array,
  /**
   * Click handler for "Close" button
   */
  onCloseButtonClick: PropTypes.func,
  /**
   * Click handler for "Ok" button
   */
  onOkButtonClick: PropTypes.func,
  /**
   * The title for the dialog box
   */
  title: PropTypes.string,
  /**
   * Toggle visibility of the Dialog box
   */
  isVisible: PropTypes.bool,
  /**
   * Callback invoked when clicking the header close button
   */
  onDismissDialogBox: PropTypes.func,
  /**
   * Determines whether the okay button will display a loading state
   */
  isLoading: PropTypes.bool,
  /**
   * Child elements defined within the DialogBox component
   */
  children: PropTypes.any,
  /**
   * Determines whether to trigger onDismissDialogBox on outside click of Dialog box
   */
  isDismissable: PropTypes.bool,
  /**
   * Determines whether the okay button will be disabled
   */
  isDisabledOkButton: PropTypes.bool,
  /**
   * Determines whether the cancel button will be disabled
   */
  isDisabledCancelButton: PropTypes.bool,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default DialogBox;
