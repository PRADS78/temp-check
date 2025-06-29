import PropTypes from "prop-types";
import styles from "./LocalizedBanner.module.scss";

const LocalizedBanner = ({ style, message, ctrCls }) => {
  return (
    <div
      className={`${styles.bannerContainer} ${ctrCls}`}
      style={style}
      role="alertdialog"
    >
      {message}
    </div>
  );
};

LocalizedBanner.propTypes = {
  style: PropTypes.object,
  message: PropTypes.string,
  ctrCls: PropTypes.string,
};

export default LocalizedBanner;
