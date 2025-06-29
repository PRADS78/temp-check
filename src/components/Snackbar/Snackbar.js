import styles from "./Snackbar.module.scss";
import { PlainButton, PrimaryButton } from "../AppButton";
import PropTypes from "prop-types";
import { ErrorIcon, SuccessIcon, WarningIcon } from "../../Icons";
import { useRef, useImperativeHandle, forwardRef } from "react";
import { useState, useEffect } from "react";
import "@disprz/icons/build/index.css";
import { SnackBarTypes } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { SnackBarDuration } from "../../Enums";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const Snackbar = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Snackbar");
    invariantUniqueId(props.uniqueId, "Snackbar");
  }, [automationIdPrefix, props.uniqueId]);

  const [canShowSnackBar, setCanShowSnackBar] = useState(false);
  const autoCloseTimeOutRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      setCanShowSnackBar(true);
      initializeAutoCloseTimeout();
    },
    hide: () => {
      return new Promise((resolve) => {
        setCanShowSnackBar(false);
        clearTimeout(autoCloseTimeOutRef.current);
        return resolve();
      });
    },
  }));

  const getTypeIcon = () => {
    const { type } = props;
    switch (type) {
      case SnackBarTypes.WARNING:
        return (
          <WarningIcon
            className={`${styles.warningIcon} cursor-default no-hover`}
          />
        );
      case SnackBarTypes.ERROR:
        return (
          <ErrorIcon
            className={`${styles.errorIcon} cursor-default no-hover`}
          />
        );
      default:
        return (
          <SuccessIcon
            className={`${styles.successIcon} cursor-default no-hover`}
          />
        );
    }
  };

  const typeTranslationMap = {
    [SnackBarTypes.WARNING]: t("common.warning"),
    [SnackBarTypes.SUCCESS]: t("common.success"),
    [SnackBarTypes.ERROR]: t("common.error.label"),
  };

  const initializeAutoCloseTimeout = () => {
    if (props.duration === SnackBarDuration.INDEFINITE) {
      return;
    }
    autoCloseTimeOutRef.current = setTimeout(() => {
      setCanShowSnackBar(false);
    }, props.duration);
  };

  return (
    <div
      className={`${styles.snackbar} ${
        props.type ? styles.typeContainer : ""
      } ${canShowSnackBar ? styles.entering : ""} ${
        props.ctrCls ? props.ctrCls : ""
      }`}
      onMouseEnter={() => {
        canShowSnackBar && setCanShowSnackBar(true);
        clearTimeout(autoCloseTimeOutRef.current);
      }}
      onMouseLeave={() => {
        if (canShowSnackBar) {
          initializeAutoCloseTimeout();
        }
      }}
      role="dialog"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-snackbar`}
    >
      {props.type ? (
        <div className={styles.typeIconSection}>
          {getTypeIcon()}
          <div className={styles.typeIconMessage}>
            <div className={styles.typeIconLabel}>
              {props.title ? props.title : typeTranslationMap[props.type]}
            </div>
            <span className={styles.iconMessage} role={"caption"}>
              {props.message}
            </span>
          </div>
        </div>
      ) : (
        <>
          <span className={styles.barLabel} id="messageLabel" role={"caption"}>
            {props.message}
          </span>
          <div className={styles.buttonSection}>
            {props.canShowDismiss && (
              <PlainButton
                ctrCls={styles.plainActionButton}
                label={t("common.dismiss")}
                tooltipText={t("common.dismiss")}
                uniqueId={1666951520667}
                onClick={() => {
                  setCanShowSnackBar(false);
                }}
              />
            )}
            {props.action &&
              (props.canShowDismiss ? (
                <PrimaryButton
                  ctrCls="primary-button"
                  label={props.action.label}
                  tooltipText={props.action.label}
                  onClick={props.action.onClick}
                  uniqueId={1666951545232}
                />
              ) : (
                <PlainButton
                  ctrCls={styles.plainActionButton}
                  label={props.action.label}
                  tooltipText={props.action.label}
                  uniqueId={1669208132255}
                  onClick={props.action.onClick}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
});

Snackbar.displayName = "Snackbar";

Snackbar.defaultProps = {
  ctrCls: "",
  message: "",
  title: "",
  canShowDismiss: false,
  type: "",
  action: undefined,
  duration: SnackBarDuration.LONG,
};

Snackbar.propTypes = {
  /**
   * Message to be displayed in the snackbar
   */
  message: PropTypes.string.isRequired,
  /**
   * Action to be displayed in the snackbar
   */
  action: PropTypes.object,
  /**
   * Denotes whether the dismiss button should be shown or not
   */
  canShowDismiss: PropTypes.bool,
  /**
   * Type of the snackbar, changes the icon of the snackbar
   */
  type: PropTypes.oneOf([
    SnackBarTypes.ERROR,
    SnackBarTypes.SUCCESS,
    SnackBarTypes.WARNING,
  ]),
  /**
   * Custom class to be applied to the snackbar
   */
  ctrCls: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Duration of the snackbar
   */
  duration: PropTypes.oneOf([
    SnackBarDuration.INDEFINITE,
    SnackBarDuration.SHORT,
    SnackBarDuration.LONG,
  ]),
  /**
   * title to be displayed in the snackbar
   */
  title: PropTypes.string,
};

export default Snackbar;
