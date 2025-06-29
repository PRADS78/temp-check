import { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ResponsiveBar, ResponsiveBarCanvas } from "@nivo/bar";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import styles from "./Charts.module.scss";

const Bar = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "BarChart");
    invariantUniqueId(props.uniqueId, "BarChart");
  }, [automationIdPrefix, props.uniqueId]);

  if (props.isCanvas) {
    return (
      <div
        className={`${styles.container} ${props.ctrCls}`}
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-canvas-bar-chart`}
      >
        <ResponsiveBarCanvas {...props} ref={ref} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.container} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-svg-bar-chart`}
    >
      <ResponsiveBar {...props} ref={ref} />
    </div>
  );
});

Bar.displayName = "Bar";

Bar.propTypes = {
  ...ResponsiveBar.propTypes,
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

Bar.defaultProps = {
  ctrCls: "",
};

export default Bar;
