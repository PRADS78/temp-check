import { forwardRef, useEffect } from "react";
import { ResponsiveLine, ResponsiveLineCanvas } from "@nivo/line";
import styles from "./Charts.module.scss";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import PropTypes from "prop-types";

const Line = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "LineChart");
    invariantUniqueId(props.uniqueId, "LineChart");
  }, [automationIdPrefix, props.uniqueId]);

  if (props.isCanvas) {
    return (
      <div
        className={`${styles.container} ${props.ctrCls}`}
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-canvas-line-chart`}
      >
        <ResponsiveLineCanvas {...props} ref={ref} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.container} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-svg-line-chart`}
    >
      <ResponsiveLine {...props} ref={ref} />
    </div>
  );
});

Line.displayName = "Line";

Line.propTypes = {
  ...ResponsiveLine.propTypes,
  /**
   * Determines whether to use canvas or svg
   */
  isCanvas: PropTypes.bool,
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Line.defaultProps = {
  ctrCls: "",
};

export default Line;
