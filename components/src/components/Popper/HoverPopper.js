import PropTypes from "prop-types";
import { Popper } from "../Popper";
import { useDebouncedHover } from "../../hooks";
import { forwardRef, useRef, useImperativeHandle } from "react";
import { ArrowPointType } from "../../Enums/index";

const HoverPopper = forwardRef(
  (
    {
      referenceElement,
      modifiers,
      children,
      innerCtrCls,
      placement,
      arrowType,
    },
    ref
  ) => {
    const popperRef = useRef(null);

    const { isHovered: isHoverOverPopper } = useDebouncedHover(
      popperRef.current?.getInbuiltPopperRef()
    );
    const { isHovered: isHoverOverReference } =
      useDebouncedHover(referenceElement);

    //TODO: Need to include a dependency.
    useImperativeHandle(ref, () => ({
      update: popperRef.current?.update,
    }));

    return (
      <Popper
        isVisible={isHoverOverReference || isHoverOverPopper}
        referenceElement={referenceElement}
        innerCtrCls={innerCtrCls}
        isPortal
        placement={placement}
        modifiers={modifiers}
        canShowArrow={true}
        ref={popperRef}
        arrowType={arrowType}
        role={"tooltip"}
        menuRole={"region"}
      >
        {children}
      </Popper>
    );
  }
);

HoverPopper.displayName = "HoverPopper";

HoverPopper.propTypes = {
  referenceElement: PropTypes.object,
  modifiers: PropTypes.array,
  children: PropTypes.node,
  innerCtrCls: PropTypes.string,
  placement: PropTypes.string,
  arrowType: PropTypes.oneOf([ArrowPointType.SHARP, ArrowPointType.SMOOTH]),
};

HoverPopper.defaultProps = {
  referenceElement: null,
  modifiers: [],
  children: null,
  innerCtrCls: "",
  placement: "bottom",
  arrowType: ArrowPointType.SMOOTH,
};

export default HoverPopper;
