import PropTypes from "prop-types";
import {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
} from "react";
import { usePopper } from "react-popper";
import popperStyles from "./Popper.module.scss";
import ReactDOM from "react-dom";
import { useWindowClick } from "../../hooks";
import Arrow from "./Arrow";
import {
  ArrowPointType,
  PopperPlacements,
  PopperReferenceStrategies,
} from "../../Enums/index";
import { isRTL } from "../../Utils";

const Popper = forwardRef(
  (
    {
      referenceElement,
      modifiers,
      placement,
      children,
      ctrCls,
      innerCtrCls,
      isVisible,
      isPortal,
      onClickOutside,
      canShowArrow,
      arrowType,
      role,
      menuRole,
      referenceStrategy,
    },
    ref
  ) => {
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const animationRef = useRef();

    const rtlPlacements = {
      [PopperPlacements.LEFT]: PopperPlacements.RIGHT,
      [PopperPlacements.RIGHT]: PopperPlacements.LEFT,
      [PopperPlacements.TOP_START]: PopperPlacements.TOP_END,
      [PopperPlacements.TOP_END]: PopperPlacements.TOP_START,
      [PopperPlacements.BOTTOM_START]: PopperPlacements.BOTTOM_END,
      [PopperPlacements.BOTTOM_END]: PopperPlacements.BOTTOM_START,
      [PopperPlacements.LEFT_START]: PopperPlacements.RIGHT_START,
      [PopperPlacements.RIGHT_START]: PopperPlacements.LEFT_START,
      [PopperPlacements.LEFT_END]: PopperPlacements.RIGHT_END,
      [PopperPlacements.RIGHT_END]: PopperPlacements.LEFT_END,
      [PopperPlacements.TOP]: PopperPlacements.TOP,
      [PopperPlacements.BOTTOM]: PopperPlacements.BOTTOM,
      [PopperPlacements.AUTO]: PopperPlacements.AUTO,
    };

    const adjustedPlacement = isRTL() ? rtlPlacements[placement] : placement;

    const _modifiers = useMemo(() => {
      if (canShowArrow) {
        return [
          ...modifiers,
          {
            name: "arrow",
            options: {
              element: arrowElement,
              padding: 8,
            },
          },
        ];
      }
      return modifiers;
    }, [arrowElement, canShowArrow, modifiers]);

    const { styles, attributes, update, destroy } = usePopper(
      referenceElement,
      popperElement,
      {
        placement: adjustedPlacement,
        modifiers: _modifiers,
        strategy: referenceStrategy,
      }
    );

    const popperCurrentPlacement =
      attributes.popper && attributes.popper["data-popper-placement"];

    // Hack to resolve this issue - https://github.com/floating-ui/floating-ui/issues/2276
    const isPopperReferenceHidden = isVisible
      ? false
      : attributes.popper?.["data-popper-reference-hidden"];

    useImperativeHandle(
      ref,
      () => ({
        getInbuiltPopperRef: () => popperElement,
        update: () => {
          if (update) update();
        },
      }),
      [popperElement, update]
    );

    useEffect(() => {
      if (isVisible && update) {
        animationRef.current = requestAnimationFrame(update);
      }
      return () => cancelAnimationFrame(animationRef.current);
    }, [isVisible, update]);

    useEffect(() => {
      const hasDestroy = destroy;
      return () => {
        if (hasDestroy) {
          destroy();
        }
      };
    }, [destroy]);

    useWindowClick(
      useCallback(
        (event) => {
          if (isVisible) {
            /* istanbul ignore else */
            if (
              event.composedPath().length > 0 &&
              !event.composedPath().includes(referenceElement)
            ) {
              onClickOutside();
            }
          }
        },
        [isVisible, onClickOutside, referenceElement]
      )
    );

    const renderContents = () => {
      return (
        <div
          ref={setPopperElement}
          style={styles.popper}
          className={`${popperStyles.popperContainer} ${
            canShowArrow ? popperStyles.canShowArrow : ""
          } ${ctrCls}`}
          role={role}
          {...attributes.popper}
          data-popper-reference-hidden={isPopperReferenceHidden}
        >
          {isVisible && (
            <div
              className={`${popperStyles.innerContainer} ${
                isVisible ? popperStyles.open : ""
              } ${innerCtrCls}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              role={menuRole}
            >
              {children}
            </div>
          )}
          {canShowArrow && (
            <Arrow
              ctrCls={`${isVisible ? popperStyles.open : ""}`}
              placement={popperCurrentPlacement}
              style={styles.arrow}
              ref={setArrowElement}
              type={arrowType}
            />
          )}
        </div>
      );
    };

    return isPortal
      ? ReactDOM.createPortal(
          renderContents(),
          document.getElementById("disprz-popper")
        )
      : renderContents();
  }
);

Popper.displayName = "Popper";

Popper.propTypes = {
  children: PropTypes.node.isRequired,
  referenceElement: PropTypes.object,
  modifiers: PropTypes.array,
  placement: PropTypes.string,
  ctrCls: PropTypes.string,
  innerCtrCls: PropTypes.string,
  isVisible: PropTypes.bool,
  isPortal: PropTypes.bool,
  onClickOutside: PropTypes.func,
  canShowArrow: PropTypes.bool,
  arrowType: PropTypes.oneOf([ArrowPointType.SHARP, ArrowPointType.SMOOTH]),
  role: PropTypes.string,
  menuRole: PropTypes.string,
  referenceStrategy: PropTypes.oneOf(Object.values(PopperReferenceStrategies)),
};

Popper.defaultProps = {
  modifiers: [],
  placement: PopperPlacements.BOTTOM,
  isVisible: false,
  isPortal: false,
  /* istanbul ignore next */
  onClickOutside: () => undefined,
  ctrCls: "",
  canShowArrow: false,
  role: "dialog",
  menuRole: "menu",
  arrowType: ArrowPointType.SMOOTH,
  referenceStrategy: PopperReferenceStrategies.ABSOLUTE,
};

export default Popper;
