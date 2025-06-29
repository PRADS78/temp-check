import PropTypes from "prop-types";
import { ProgressBarSize } from "../../Enums";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ ctrCls, value, size, filledCtrCls }) => {
  return (
    <div
      className={`${styles.progressBar} ${ctrCls} ${
        size === ProgressBarSize.BIG ? styles.bigLine : ""
      }`}
      role="region"
    >
      <div
        className={`${styles.filled} ${filledCtrCls}`}
        style={{ width: `${value}%` }}
        role="status"
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  /**
   * Specify ctrCls for the ProgressBar
   */
  ctrCls: PropTypes.string,
  /**
   * set value of progress bar
   */
  value: PropTypes.number,
  /**
   * set size of progress bar
   */
  size: PropTypes.oneOf([ProgressBarSize.SMALL, ProgressBarSize.BIG]),
  /**
   * Specify filledCtrCls for the ProgressBar
   */
  filledCtrCls: PropTypes.string,
};

ProgressBar.defaultProps = {
  ctrCls: "",
  value: 0,
  size: ProgressBarSize.SMALL,
  filledCtrCls: "",
};

export default ProgressBar;
