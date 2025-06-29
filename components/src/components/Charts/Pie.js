import { forwardRef, useEffect } from "react";
import { ResponsivePie, ResponsivePieCanvas } from "@nivo/pie";
import PropTypes from "prop-types";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import styles from "./Charts.module.scss";

const Pie = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "PieChart");
    invariantUniqueId(props.uniqueId, "PieChart");
  }, [automationIdPrefix, props.uniqueId]);

  if (props.isCanvas) {
    return (
      <div
        className={`${styles.container} ${props.ctrCls}`}
        data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-canvas-pie-chart`}
      >
        <ResponsivePieCanvas {...props} ref={ref} />
      </div>
    );
  }
  return (
    <div
      className={`${styles.container} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-svg-pie-chart`}
    >
      <ResponsivePie {...props} ref={ref} />
    </div>
  );
});

Pie.displayName = "Pie";

Pie.propTypes = {
  ...ResponsivePie.propTypes,
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

Pie.defaultProps = {
  ctrCls: "",
};

export default Pie;
