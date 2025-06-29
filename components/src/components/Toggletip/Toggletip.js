import PropTypes from "prop-types";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./Toggletip.module.scss";
import { Popper } from "../Popper";
import { ToggleTipPositions } from "../../Enums/index";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const ToggleTip = forwardRef(
  (
    {
      children,
      referenceRef,
      onReferenceClick,
      onClickOutside,
      position,
      uniqueId,
    },
    ref
  ) => {
    const automationIdPrefix = useAutomationIdPrefix();

    useEffect(() => {
      invariantAutomationPrefixId(automationIdPrefix, "Toggletip");
      invariantUniqueId(uniqueId, "Toggletip");
    }, [automationIdPrefix, uniqueId]);

    const [isVisible, setIsVisible] = useState(false);

    const modifiers = useMemo(
      () => [
        {
          name: "offset",
          options: {
            offset: [0, 16],
          },
        },
      ],
      []
    );

    const _onClick = useCallback(
      (e) => {
        onReferenceClick(e, isVisible);
        setIsVisible((prevState) => !prevState);
      },
      [isVisible, onReferenceClick]
    );

    useEffect(() => {
      const node = referenceRef;
      if (node) {
        node.addEventListener("click", _onClick);
      }
      return () => {
        if (node) {
          node.removeEventListener("click", _onClick);
        }
      };
    }, [_onClick, isVisible, onReferenceClick, referenceRef]);

    useImperativeHandle(
      ref,
      () => {
        return {
          show: () => {
            setIsVisible(true);
          },
          hide: () => {
            setIsVisible(false);
          },
        };
      },
      []
    );

    const _onClickOutside = (e) => {
      onClickOutside(e, isVisible);
      setIsVisible(false);
    };

    return (
      <Popper
        referenceElement={referenceRef}
        isVisible={isVisible}
        isPortal
        placement={position}
        canShowArrow={true}
        modifiers={modifiers}
        innerCtrCls={styles.innerCtrCls}
        ctrCls={styles.popperContainer}
        onClickOutside={_onClickOutside}
      >
        {children}
      </Popper>
    );
  }
);

ToggleTip.displayName = "ToggleTip";

ToggleTip.propTypes = {
  /**
   * Contents to render inside the ToggleTip
   */
  children: PropTypes.node,
  /**
   * Position of the Toggletip
   */
  position: PropTypes.oneOf([
    ToggleTipPositions.AUTO,
    ToggleTipPositions.TOP,
    ToggleTipPositions.TOP_START,
    ToggleTipPositions.TOP_END,
    ToggleTipPositions.BOTTOM,
    ToggleTipPositions.BOTTOM_START,
    ToggleTipPositions.BOTTOM_END,
    ToggleTipPositions.LEFT,
    ToggleTipPositions.LEFT_START,
    ToggleTipPositions.LEFT_END,
    ToggleTipPositions.RIGHT,
    ToggleTipPositions.RIGHT_START,
    ToggleTipPositions.RIGHT_END,
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
   * Callback for when the reference is clicked
   */
  onReferenceClick: PropTypes.func,
  /**
   * Callback for when the user clicks outside the Toggletip
   */
  onClickOutside: PropTypes.func,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

/* istanbul ignore next */
ToggleTip.defaultProps = {
  position: ToggleTipPositions.AUTO,
  onReferenceClick: () => undefined,
  onClickOutside: () => undefined,
};

export default ToggleTip;
