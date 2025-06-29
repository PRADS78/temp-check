import { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ResponsiveScatterPlot,
  ResponsiveScatterPlotCanvas,
} from "@nivo/scatterplot";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import styles from "./Charts.module.scss";

const ScatterPlot = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "ScatterPlotChart");
    invariantUniqueId(props.uniqueId, "ScatterPlotChart");
  }, [automationIdPrefix, props.uniqueId]);

  if (props.isCanvas) {
    return (
      <div
        className={`${styles.container} ${props.ctrCls}`}
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-canvas-scatter-plot-chart`}
      >
        <ResponsiveScatterPlotCanvas {...props} ref={ref} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.container} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-svg-scatter-plot-chart`}
    >
      <ResponsiveScatterPlot {...props} ref={ref} />
    </div>
  );
});

ScatterPlot.displayName = "ScatterPlot";

ScatterPlot.propTypes = {
  ...ResponsiveScatterPlot.propTypes,
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

ScatterPlot.defaultProps = {
  ctrCls: "",
};

export default ScatterPlot;
