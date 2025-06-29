import { ResponsiveFunnel } from "@nivo/funnel";
import { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import styles from "./Charts.module.scss";

const Funnel = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "FunnelChart");
    invariantUniqueId(props.uniqueId, "FunnelChart");
  }, [automationIdPrefix, props.uniqueId]);

  return (
    <div
      className={`${styles.container} ${props.ctrCls}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-svg-funnel-chart`}
      style={{ height: "100%", width: "100%" }}
    >
      <ResponsiveFunnel {...props} ref={ref} />
    </div>
  );
});

Funnel.displayName = "Funnel";

Funnel.propTypes = {
  ...ResponsiveFunnel.propTypes,
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

Funnel.defaultProps = {
  ctrCls: "",
};

export default Funnel;
