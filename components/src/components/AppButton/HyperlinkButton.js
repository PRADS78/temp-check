import { forwardRef } from "react";
import BaseButton from "./BaseButton";
import styles from "./BaseButton.module.scss";

const HyperlinkButton = forwardRef((props, ref) => {
  return (
    <BaseButton
      {...props}
      ctrCls={`${styles.hyperlink} ${props.ctrCls}`}
      ref={ref}
    />
  );
});

HyperlinkButton.displayName = "HyperlinkButton";

HyperlinkButton.propTypes = {
  // Only works for ESLINT
  ...BaseButton.propTypes,
};

HyperlinkButton.defaultProps = {};

export default HyperlinkButton;
