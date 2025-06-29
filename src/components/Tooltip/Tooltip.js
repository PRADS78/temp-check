import styles from "./Tooltip.module.scss";
import { useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { HoverPopper } from "../Popper";
import { ArrowPointType, ToolTipTypes } from "../../Enums";
import { ToolTipPositions } from "../../Enums/index";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const Tooltip = (props) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const popperRef = useRef(null);

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Tooltip");
    invariantUniqueId(props.uniqueId, "Tooltip");
  }, [automationIdPrefix, props.uniqueId]);
  const animationRef = useRef();

  useEffect(() => {
    animationRef.current = requestAnimationFrame(popperRef.current?.update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [props.message, popperRef.current?.update]);

  const modifiers = useMemo(
    () => [
      {
        name: "offset",
        options: {
          offset: [0, props.type === ToolTipTypes.PROGRESS ? 8 : 16],
        },
      },
    ],
    [props.type]
  );

  const canShowTitle = !!String(props.title).trim();

  const renderToolTipTypes = () => {
    switch (props.type) {
      case ToolTipTypes.PROGRESS:
        return (
          <div className={`${styles.container}`}>
            <span className={styles.message}>{props.message}</span>
          </div>
        );
      default:
        return (
          <div
            className={`${styles.container} ${
              canShowTitle ? styles.withTitle : ""
            }`}
          >
            {canShowTitle && (
              <span className={styles.title}>{props.title}</span>
            )}
            <span className={styles.message}>{props.message}</span>
          </div>
        );
    }
  };

  return (
    <HoverPopper
      ref={popperRef}
      referenceElement={props.referenceRef}
      isPortal
      placement={props.position}
      modifiers={modifiers}
      innerCtrCls={`${styles.popperContainer} ${
        props.type === ToolTipTypes.PROGRESS ? styles.progressType : ""
      }`}
      canShowArrow={true}
      arrowType={
        props.type === ToolTipTypes.PROGRESS
          ? ArrowPointType.SHARP
          : ArrowPointType.SMOOTH
      }
    >
      {renderToolTipTypes()}
    </HoverPopper>
  );
};

Tooltip.propTypes = {
  /**
   * Message to be displayed in the tooltip
   */
  message: PropTypes.string,
  /**
   * Title to be displayed in the tooltip
   */
  title: PropTypes.string,
  /**
   * Position of the tooltip
   */
  position: PropTypes.oneOf([
    ToolTipPositions.AUTO,
    ToolTipPositions.TOP,
    ToolTipPositions.TOP_START,
    ToolTipPositions.TOP_END,
    ToolTipPositions.BOTTOM,
    ToolTipPositions.BOTTOM_START,
    ToolTipPositions.BOTTOM_END,
    ToolTipPositions.LEFT,
    ToolTipPositions.LEFT_START,
    ToolTipPositions.LEFT_END,
    ToolTipPositions.RIGHT,
    ToolTipPositions.RIGHT_START,
    ToolTipPositions.RIGHT_END,
  ]),
  /**
   * Reference element for the tooltip (Either a useState or useRef current object) <s>*</s>
   *
   * Example:
   *
   * useRef -
   *
   * ```js
   * const referenceRef = useRef(null);
   * <ToolTip referenceRef={referenceRef.current}/>
   * ```
   *
   * useState -
   *
   * ```js
   * const [referenceRef, setReferenceRef] = useState(null);
   * <ToolTip referenceRef={referenceRef}/>
   * ```
   *
   * <s>*</s> Required DisprzPortalDomProvider from disprz components
   */
  referenceRef: PropTypes.object,
  /**
   * Type of the tooltip (Default or Progress)
   *
   * Default - Default tooltip
   * Progress - This is used in combination with any progress component
   */
  type: PropTypes.oneOf([ToolTipTypes.DEFAULT, ToolTipTypes.PROGRESS]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Tooltip.defaultProps = {
  message: "",
  title: "",
  position: ToolTipPositions.AUTO,
  type: ToolTipTypes.DEFAULT,
};

export default Tooltip;
