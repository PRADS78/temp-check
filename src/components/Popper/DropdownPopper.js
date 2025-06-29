import { useMemo } from "react";
import maxSize from "popper-max-size-modifier";
import Popper from "./Popper";
import PropTypes from "prop-types";
import { DropDownPosition } from "../../Enums";
import { PopperReferenceStrategies } from "../../Enums/index";

const DropdownPopper = ({
  children,
  position,
  isActive,
  referenceRef,
  innerCtrCls,
  ctrCls,
  onClickOutside,
  boundaryRef,
  canUsePortal,
  maxHeight,
  isMenuWidthSameAsReference,
  referenceStrategy,
}) => {
  const modifiers = useMemo(() => {
    return [
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom", "top"],
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "sameWidth",
        enabled: isMenuWidthSameAsReference,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: ({ state }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
        },
        effect: ({ state }) => {
          state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
        },
      },
      {
        ...maxSize,
        options: {
          padding: 20,
          boundary: boundaryRef,
        },
      },
      {
        name: "applyMaxSize",
        enabled: true,
        phase: "beforeWrite",
        requires: ["maxSize"],
        fn({ state }) {
          // The `maxSize` modifier provides this data
          const { height } = state.modifiersData.maxSize;
          if (!isMenuWidthSameAsReference) {
            const popperWidth = state.rects.popper.width;
            const referenceWidth = state.rects.reference.width;
            if (popperWidth > referenceWidth) {
              state.styles.popper.minWidth = `${popperWidth}px`;
            } else {
              state.styles.popper.minWidth = `${referenceWidth}px`;
            }
          }
          state.styles.popper = {
            ...state.styles.popper,
            height: "auto",
            maxHeight: maxHeight
              ? `${maxHeight}px`
              : `${Math.max(height, 200)}px`,
          };
        },
      },
    ];
    // `isActive` not used anywhere; it added as dependency. Because when changing dropdown value to recalculate the UI position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundaryRef, maxHeight, isActive]);

  return (
    <Popper
      isVisible={isActive}
      referenceElement={referenceRef}
      innerCtrCls={innerCtrCls}
      ctrCls={ctrCls}
      modifiers={modifiers}
      placement={position}
      onClickOutside={onClickOutside}
      isPortal={canUsePortal}
      referenceStrategy={referenceStrategy}
    >
      {children}
    </Popper>
  );
};

DropdownPopper.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(Object.values(DropDownPosition)),
  isActive: PropTypes.bool,
  referenceRef: PropTypes.object,
  innerCtrCls: PropTypes.string,
  ctrCls: PropTypes.string,
  onClickOutside: PropTypes.func,
  boundaryRef: PropTypes.object,
  canUsePortal: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isMenuWidthSameAsReference: PropTypes.bool,
  referenceStrategy: PropTypes.oneOf(Object.values(PopperReferenceStrategies)),
};

DropdownPopper.defaultProps = {
  position: DropDownPosition.BOTTOM,
  innerCtrCls: "",
  ctrCls: "",
  onClickOutside: () => undefined,
  boundaryRef: null,
  canUsePortal: true,
  maxHeight: undefined,
  isMenuWidthSameAsReference: true,
};

export default DropdownPopper;
