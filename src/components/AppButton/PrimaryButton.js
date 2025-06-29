import { forwardRef } from "react";
import BaseButton from "./BaseButton";
import styles from "./BaseButton.module.scss";

const PrimaryButton = forwardRef((props, ref) => {
  return (
    <BaseButton
      {...props}
      ctrCls={`${styles.primary} ${props.ctrCls}`}
      ref={ref}
    />
  );
});

PrimaryButton.displayName = "PrimaryButton";

PrimaryButton.propTypes = {
  // Only works for ESLINT
  ...BaseButton.propTypes,
};

PrimaryButton.defaultProps = {};

export default PrimaryButton;
