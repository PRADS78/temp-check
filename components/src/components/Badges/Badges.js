import PropTypes from "prop-types";
import styles from "./Badges.module.scss";

function Badges({ count, max, children, ctrCls, canShow, isInline }) {
  const isNumbered = count > -1;

  const cappedNumber = count > max ? `${max}+` : count;
  return (
    <div
      className={`${styles.wrapper} ${ctrCls}`}
      data-testid="badge-container"
    >
      {!isInline && children}
      {canShow || isInline ? (
        <div
          className={`${styles.badge} ${isNumbered ? styles.numbered : ""} ${
            isInline ? styles.inline : ""
          }`}
          role="status"
          data-role="badge"
        >
          {isNumbered ? cappedNumber : null}
        </div>
      ) : null}
    </div>
  );
}

Badges.propTypes = {
  /**
   * Container class for Badges
   */
  ctrCls: PropTypes.string,
  /**
   * Number value to show in Badges
   */
  count: PropTypes.number,
  /**
   * Wrapper to show the badge for, displayed in top right of the children. Accepts a HTML/React component
   */
  children: PropTypes.node,
  /**
   * Max value for the Badges
   */
  max: PropTypes.number,
  /**
   * Boolean to show/hide the Badges (render null if false)
   */
  canShow: PropTypes.bool,
  /**
   * Boolean to render the Badges inline without the children
   */
  isInline: PropTypes.bool,
};

Badges.defaultProps = {
  ctrCls: "",
  count: -1,
  max: 99,
  canShow: true,
  isInline: false,
};

export default Badges;
