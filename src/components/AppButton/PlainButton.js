import BaseButton from "./BaseButton";
import styles from "./Plain.module.scss";
import { forwardRef } from "react";

const PlainButton = forwardRef((props, ref) => {
  return (
    <BaseButton
      {...props}
      ctrCls={`${styles.plain}  ${props.ctrCls}`}
      ref={ref}
    />
  );
});

PlainButton.displayName = "PlainButton";

PlainButton.propTypes = {
  // Only works for ESLINT
  ...BaseButton.propTypes,
};

PlainButton.defaultProps = {};

export default PlainButton;
