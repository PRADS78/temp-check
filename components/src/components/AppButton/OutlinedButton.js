import { forwardRef } from "react";
import BaseButton from "./BaseButton";
import styles from "./Outlined.module.scss";

const OutlinedButton = forwardRef((props, ref) => {
  return (
    <BaseButton
      {...props}
      ctrCls={`${styles.outlined} ${
        typeof props.icon === "function" ? styles.withIcon : ""
      } ${props.ctrCls}`}
      ref={ref}
    />
  );
});

OutlinedButton.displayName = "OutlinedButton";

OutlinedButton.propTypes = {
  // Only works for ESLINT
  ...BaseButton.propTypes,
};

OutlinedButton.defaultProps = {};

export default OutlinedButton;
