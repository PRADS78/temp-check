import { useCallback, useMemo, useEffect } from "react";
import styles from "./AlertDialog.module.scss";
import PropTypes from "prop-types";
import {
  OutlinedButton,
  PlainButton,
  PrimaryButton,
} from "../../components/AppButton";
import { RingLoader } from "../../components/DialogBox/RingLoader";
import { CSSTransition } from "react-transition-group";
import { AlertDialogTypes } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantUniqueId, invariantAutomationPrefixId } from "../../Utils";
import "@disprz/icons/build/index.css";
import { motion } from "framer-motion";

function AlertDialog(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "AlertDialog");
    invariantUniqueId(props.uniqueId, "AlertDialog");
  }, [automationIdPrefix, props.uniqueId]);

  const getTypeSpecificClassName = useCallback(() => {
    let typeSpecificClassName;
    switch (props.type) {
      case AlertDialogTypes.ERROR:
        typeSpecificClassName = "error";
        break;
      case AlertDialogTypes.SUCCESS:
        typeSpecificClassName = "success";
        break;
      case AlertDialogTypes.WARNING:
        typeSpecificClassName = "warning";
        break;
    }
    return typeSpecificClassName;
  }, [props.type]);

  const renderTitle = useCallback(() => {
    const tickMarkAnimate = {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          delay: 0.5,
          duration: 1,
        },
      },
    };
    const rotateAnimate = {
      show: {
        rotate: 360,
        transition: {
          duration: 6,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      },
    };
    const scaleAnimate = {
      show: {
        scale: [0, 1],
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };
    switch (props.type) {
      case AlertDialogTypes.ERROR:
        return (
          <div className={`${styles.title} ${styles.error}`}>
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={scaleAnimate}
              animate={"show"}
            >
              <motion.path
                d="M21.1781 9.6375C20.8219 9.27188 20.4562 8.8875 20.3156 8.55938C20.175 8.23125 20.1844 7.74375 20.175 7.24688C20.1656 6.3375 20.1469 5.29688 19.425 4.575C18.7031 3.85312 17.6625 3.83437 16.7531 3.825C16.2562 3.81562 15.75 3.80625 15.4406 3.68437C15.1312 3.5625 14.7281 3.17813 14.3625 2.82188C13.7156 2.20313 12.975 1.5 12 1.5C11.025 1.5 10.2844 2.20313 9.6375 2.82188C9.27188 3.17813 8.8875 3.54375 8.55938 3.68437C8.23125 3.825 7.74375 3.81562 7.24688 3.825C6.3375 3.83437 5.29688 3.85312 4.575 4.575C3.85312 5.29688 3.83437 6.3375 3.825 7.24688C3.81562 7.74375 3.80625 8.25 3.68437 8.55938C3.5625 8.86875 3.17813 9.27188 2.82188 9.6375C2.20313 10.2844 1.5 11.025 1.5 12C1.5 12.975 2.20313 13.7156 2.82188 14.3625C3.17813 14.7281 3.54375 15.1125 3.68437 15.4406C3.825 15.7687 3.81562 16.2562 3.825 16.7531C3.83437 17.6625 3.85312 18.7031 4.575 19.425C5.29688 20.1469 6.3375 20.1656 7.24688 20.175C7.74375 20.1844 8.25 20.1938 8.55938 20.3156C8.86875 20.4375 9.27188 20.8219 9.6375 21.1781C10.2844 21.7969 11.025 22.5 12 22.5C12.975 22.5 13.7156 21.7969 14.3625 21.1781C14.7281 20.8219 15.1125 20.4562 15.4406 20.3156C15.7687 20.175 16.2562 20.1844 16.7531 20.175C17.6625 20.1656 18.7031 20.1469 19.425 19.425C20.1469 18.7031 20.1656 17.6625 20.175 16.7531C20.1844 16.2562 20.1938 15.75 20.3156 15.4406C20.4375 15.1312 20.8219 14.7281 21.1781 14.3625C21.7969 13.7156 22.5 12.975 22.5 12C22.5 11.025 21.7969 10.2844 21.1781 9.6375Z"
                fill="#da3832"
                variants={rotateAnimate}
                animate={"show"}
              />
              <motion.path
                variants={tickMarkAnimate}
                initial={"hidden"}
                animate={"visible"}
                d="M11.25 7.5C11.25 7.30109 11.329 7.11032 11.4697 6.96967C11.6103 6.82902 11.8011 6.75 12 6.75C12.1989 6.75 12.3897 6.82902 12.5303 6.96967C12.671 7.11032 12.75 7.30109 12.75 7.5V12.75C12.75 12.9489 12.671 13.1397 12.5303 13.2803C12.3897 13.421 12.1989 13.5 12 13.5C11.8011 13.5 11.6103 13.421 11.4697 13.2803C11.329 13.1397 11.25 12.9489 11.25 12.75V7.5Z"
                fill="#fff"
              />
              <motion.path
                d="M12 17.25C11.7775 17.25 11.56 17.184 11.375 17.0604C11.19 16.9368 11.0458 16.7611 10.9606 16.5555C10.8755 16.35 10.8532 16.1238 10.8966 15.9055C10.94 15.6873 11.0472 15.4868 11.2045 15.3295C11.3618 15.1722 11.5623 15.065 11.7805 15.0216C11.9988 14.9782 12.225 15.0005 12.4305 15.0856C12.6361 15.1708 12.8118 15.315 12.9354 15.5C13.059 15.685 13.125 15.9025 13.125 16.125C13.125 16.4234 13.0065 16.7095 12.7955 16.9205C12.5845 17.1315 12.2984 17.25 12 17.25Z"
                variants={tickMarkAnimate}
                initial={"hidden"}
                animate={"visible"}
                fill="#fff"
              />
            </motion.svg>
            <span className={styles.titleText}>{props.title}</span>
          </div>
        );
      case AlertDialogTypes.SUCCESS:
        return (
          <div className={`${styles.title} ${styles.success}`}>
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={scaleAnimate}
              animate={"show"}
            >
              <motion.path
                d="M20.1781 8.6375C19.8219 8.27188 19.4562 7.8875 19.3156 7.55938C19.175 7.23125 19.1844 6.74375 19.175 6.24688C19.1656 5.3375 19.1469 4.29687 18.425 3.575C17.7031 2.85312 16.6625 2.83437 15.7531 2.825C15.2562 2.81562 14.75 2.80625 14.4406 2.68437C14.1312 2.5625 13.7281 2.17813 13.3625 1.82188C12.7156 1.20313 11.975 0.5 11 0.5C10.025 0.5 9.28438 1.20313 8.6375 1.82188C8.27188 2.17813 7.8875 2.54375 7.55938 2.68437C7.23125 2.825 6.74375 2.81562 6.24688 2.825C5.3375 2.83437 4.29687 2.85312 3.575 3.575C2.85312 4.29687 2.83437 5.3375 2.825 6.24688C2.81562 6.74375 2.80625 7.25 2.68437 7.55938C2.5625 7.86875 2.17813 8.27188 1.82188 8.6375C1.20313 9.28438 0.5 10.025 0.5 11C0.5 11.975 1.20313 12.7156 1.82188 13.3625C2.17813 13.7281 2.54375 14.1125 2.68437 14.4406C2.825 14.7687 2.81562 15.2562 2.825 15.7531C2.83437 16.6625 2.85312 17.7031 3.575 18.425C4.29687 19.1469 5.3375 19.1656 6.24688 19.175C6.74375 19.1844 7.25 19.1937 7.55938 19.3156C7.86875 19.4375 8.27188 19.8219 8.6375 20.1781C9.28438 20.7969 10.025 21.5 11 21.5C11.975 21.5 12.7156 20.7969 13.3625 20.1781C13.7281 19.8219 14.1125 19.4562 14.4406 19.3156C14.7687 19.175 15.2562 19.1844 15.7531 19.175C16.6625 19.1656 17.7031 19.1469 18.425 18.425C19.1469 17.7031 19.1656 16.6625 19.175 15.7531C19.1844 15.2562 19.1937 14.75 19.3156 14.4406C19.4375 14.1312 19.8219 13.7281 20.1781 13.3625C20.7969 12.7156 21.5 11.975 21.5 11C21.5 10.025 20.7969 9.28438 20.1781 8.6375V8.6375Z "
                fill="#3ab876"
                variants={rotateAnimate}
                animate={"show"}
              />
              <motion.path
                d="M15.6406 9.29375L10.1469 14.5438C10.0048 14.6774 9.81687 14.7512 9.62188 14.75C9.42975 14.7507 9.24487 14.6768 9.10625 14.5438L6.35938 11.9188C6.28319 11.8523 6.22123 11.7711 6.17722 11.6801C6.1332 11.589 6.10805 11.49 6.10328 11.389C6.0985 11.2881 6.11419 11.1871 6.14941 11.0924C6.18463 10.9976 6.23865 10.9109 6.30822 10.8375C6.37779 10.7642 6.46148 10.7056 6.55426 10.6654C6.64703 10.6252 6.74697 10.6042 6.84808 10.6036C6.94919 10.603 7.04937 10.6229 7.14261 10.662C7.23584 10.7011 7.32021 10.7587 7.39062 10.8312L9.62188 12.9594L14.6094 8.20625C14.7552 8.07902 14.9446 8.01309 15.1379 8.02223C15.3312 8.03138 15.5135 8.1149 15.6467 8.25533C15.7798 8.39576 15.8535 8.58222 15.8524 8.77575C15.8513 8.96928 15.7754 9.15488 15.6406 9.29375Z"
                variants={tickMarkAnimate}
                initial={"hidden"}
                animate={"visible"}
                fill="#fff"
              />
            </motion.svg>

            <span className={styles.titleText}>{props.title}</span>
          </div>
        );
      case AlertDialogTypes.WARNING:
        return (
          <div className={`${styles.title} ${styles.warning}`}>
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              variants={scaleAnimate}
              animate={"show"}
            >
              <motion.path
                d="M21.1781 9.6375C20.8219 9.27188 20.4562 8.8875 20.3156 8.55938C20.175 8.23125 20.1844 7.74375 20.175 7.24688C20.1656 6.3375 20.1469 5.29688 19.425 4.575C18.7031 3.85312 17.6625 3.83437 16.7531 3.825C16.2562 3.81562 15.75 3.80625 15.4406 3.68437C15.1312 3.5625 14.7281 3.17813 14.3625 2.82188C13.7156 2.20313 12.975 1.5 12 1.5C11.025 1.5 10.2844 2.20313 9.6375 2.82188C9.27188 3.17813 8.8875 3.54375 8.55938 3.68437C8.23125 3.825 7.74375 3.81562 7.24688 3.825C6.3375 3.83437 5.29688 3.85312 4.575 4.575C3.85312 5.29688 3.83437 6.3375 3.825 7.24688C3.81562 7.74375 3.80625 8.25 3.68437 8.55938C3.5625 8.86875 3.17813 9.27188 2.82188 9.6375C2.20313 10.2844 1.5 11.025 1.5 12C1.5 12.975 2.20313 13.7156 2.82188 14.3625C3.17813 14.7281 3.54375 15.1125 3.68437 15.4406C3.825 15.7687 3.81562 16.2562 3.825 16.7531C3.83437 17.6625 3.85312 18.7031 4.575 19.425C5.29688 20.1469 6.3375 20.1656 7.24688 20.175C7.74375 20.1844 8.25 20.1938 8.55938 20.3156C8.86875 20.4375 9.27188 20.8219 9.6375 21.1781C10.2844 21.7969 11.025 22.5 12 22.5C12.975 22.5 13.7156 21.7969 14.3625 21.1781C14.7281 20.8219 15.1125 20.4562 15.4406 20.3156C15.7687 20.175 16.2562 20.1844 16.7531 20.175C17.6625 20.1656 18.7031 20.1469 19.425 19.425C20.1469 18.7031 20.1656 17.6625 20.175 16.7531C20.1844 16.2562 20.1938 15.75 20.3156 15.4406C20.4375 15.1312 20.8219 14.7281 21.1781 14.3625C21.7969 13.7156 22.5 12.975 22.5 12C22.5 11.025 21.7969 10.2844 21.1781 9.6375Z"
                fill="#ea8701"
                variants={rotateAnimate}
                animate={"show"}
              />
              <motion.path
                variants={tickMarkAnimate}
                initial={"hidden"}
                animate={"visible"}
                d="M11.25 7.5C11.25 7.30109 11.329 7.11032 11.4697 6.96967C11.6103 6.82902 11.8011 6.75 12 6.75C12.1989 6.75 12.3897 6.82902 12.5303 6.96967C12.671 7.11032 12.75 7.30109 12.75 7.5V12.75C12.75 12.9489 12.671 13.1397 12.5303 13.2803C12.3897 13.421 12.1989 13.5 12 13.5C11.8011 13.5 11.6103 13.421 11.4697 13.2803C11.329 13.1397 11.25 12.9489 11.25 12.75V7.5Z"
                fill="#fff"
              />
              <motion.path
                d="M12 17.25C11.7775 17.25 11.56 17.184 11.375 17.0604C11.19 16.9368 11.0458 16.7611 10.9606 16.5555C10.8755 16.35 10.8532 16.1238 10.8966 15.9055C10.94 15.6873 11.0472 15.4868 11.2045 15.3295C11.3618 15.1722 11.5623 15.065 11.7805 15.0216C11.9988 14.9782 12.225 15.0005 12.4305 15.0856C12.6361 15.1708 12.8118 15.315 12.9354 15.5C13.059 15.685 13.125 15.9025 13.125 16.125C13.125 16.4234 13.0065 16.7095 12.7955 16.9205C12.5845 17.1315 12.2984 17.25 12 17.25Z"
                variants={tickMarkAnimate}
                initial={"hidden"}
                animate={"visible"}
                fill="#fff"
              />
            </motion.svg>
            <span className={styles.titleText}>{props.title}</span>
          </div>
        );
      default:
        return null;
    }
  }, [props.title, props.type]);

  const renderAffirmativeButton = useMemo(() => {
    return props.loading ? (
      <button className={styles.loadingButton} role="status" aria-busy="true">
        <RingLoader />
      </button>
    ) : props.positiveText ? (
      <PrimaryButton
        label={props.positiveText}
        onClick={props.onPositive}
        ctrCls={`${styles.actionButton} ${
          styles.positiveText
        } ${getTypeSpecificClassName()}`}
        uniqueId={1666015821836}
      />
    ) : null;
  }, [
    getTypeSpecificClassName,
    props.loading,
    props.onPositive,
    props.positiveText,
  ]);

  const renderNegativeButton = () => {
    return props.negativeText ? (
      <OutlinedButton
        label={props.negativeText}
        onClick={props.onNegative}
        ctrCls={`${styles.actionButton} ${
          styles.negativeText
        } ${getTypeSpecificClassName()}`}
        uniqueId={1666015837758}
      />
    ) : null;
  };

  const renderNeutralButton = () => {
    return props.neutralText ? (
      <PlainButton
        label={props.neutralText}
        onClick={props.onNeutral}
        ctrCls={`${styles.actionButton} ${
          styles.neutralText
        } ${getTypeSpecificClassName()}`}
        uniqueId={1666015854175}
      />
    ) : null;
  };

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
        className={`${styles.alertDialog} ${props.ctrCls}`}
        role="dialog"
        data-type={props.type}
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-alert-dialog`}
      >
        <div
          onClick={props.isDismissible ? props.onDismiss : null}
          className={styles.overlay}
          role="region"
          data-role="overlay"
        ></div>
        <div className={styles.component}>
          {props.title ? renderTitle() : null}
          <div
            className={`${styles.body} ${props.bodyCtrCls}`}
            role="region"
            data-role="alert-dialog-content"
          >
            {props.content}
            {props.children}
          </div>
          <div className={styles.actionButtons}>
            {renderNeutralButton()}
            {renderNegativeButton()}
            {renderAffirmativeButton}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

AlertDialog.propTypes = {
  bodyCtrCls: PropTypes.string,
  children: PropTypes.any,
  ctrCls: PropTypes.string,
  content: PropTypes.string,
  isDismissible: PropTypes.bool,
  loading: PropTypes.bool,
  negativeText: PropTypes.any,
  neutralText: PropTypes.any,
  onDismiss: PropTypes.func,
  onNegative: PropTypes.func,
  onNeutral: PropTypes.func,
  onPositive: PropTypes.func,
  positiveText: PropTypes.any,
  title: PropTypes.any,
  isVisible: PropTypes.bool,
  type: PropTypes.oneOf([
    AlertDialogTypes.ERROR,
    AlertDialogTypes.SUCCESS,
    AlertDialogTypes.WARNING,
  ]),
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

AlertDialog.defaultProps = {
  type: AlertDialogTypes.SUCCESS,
};

export default AlertDialog;
