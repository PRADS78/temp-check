import PropTypes from "prop-types";
import { forwardRef } from "react";
import { ArrowPointType } from "../../Enums";
import popperStyles from "./Popper.module.scss";

const Arrow = forwardRef(({ placement, style, ctrCls, type }, ref) => {
  let toRender = null;
  const renderTop = () => {
    return (
      <svg
        width="20"
        height="8"
        viewBox="0 0 20 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99999 8C7.12675 8 4.25361 -1.33965e-06 0.422526 -1.67458e-06L19.5775 0C15.7705 -3.32814e-07 12.8732 8 9.99999 8Z"
          fill="hsla(0, 0%, 15%, 1)"
        />
      </svg>
    );
  };

  const renderBottom = () => {
    return (
      <svg
        width="20"
        height="8"
        viewBox="0 0 20 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 0C12.8732 0 15.7464 8 19.5775 8H0.422546C4.22949 8 7.12677 0 10 0Z"
          fill="hsla(0, 0%, 15%, 1)"
        />
      </svg>
    );
  };

  const renderLeft = () => {
    return (
      <svg
        width="8"
        height="20"
        viewBox="0 0 8 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 10C8 12.8732 -6.69827e-07 15.7464 -8.37289e-07 19.5775L0 0.422531C-1.66407e-07 4.22948 8 7.12676 8 10Z"
          fill="hsla(0, 0%, 15%, 1)"
        />
      </svg>
    );
  };

  const renderRight = () => {
    return (
      <svg
        width="8"
        height="20"
        viewBox="0 0 8 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-4.18644e-07 10C-5.44237e-07 7.12677 8 4.25362 8 0.42254L8 19.5775C8 15.7705 -2.93051e-07 12.8732 -4.18644e-07 10Z"
          fill="hsla(0, 0%, 15%, 1)"
        />
      </svg>
    );
  };

  switch (placement) {
    case "top":
    case "top-start":
    case "top-end":
      toRender = renderTop();
      break;
    case "bottom":
    case "bottom-start":
    case "bottom-end":
      toRender = renderBottom();
      break;
    case "left":
    case "left-start":
    case "left-end":
      toRender = renderLeft();
      break;
    case "right":
    case "right-start":
    case "right-end":
      toRender = renderRight();
      break;
    default:
      return null;
  }

  return (
    <div
      className={`${popperStyles.arrow} ${
        type === ArrowPointType.SMOOTH
          ? popperStyles.smoothType
          : popperStyles.sharpType
      } ${ctrCls}`}
      ref={ref}
      style={style}
      data-testid="popper-arrow"
    >
      {type === ArrowPointType.SMOOTH ? toRender : null}
    </div>
  );
});

Arrow.displayName = "Arrow";

Arrow.propTypes = {
  placement: PropTypes.string,
  style: PropTypes.object,
  ctrCls: PropTypes.string,
  type: PropTypes.oneOf(Object.values(ArrowPointType)),
};

export default Arrow;
