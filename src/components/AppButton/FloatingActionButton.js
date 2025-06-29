import { AddIcon } from "../../Icons";
import styles from "./FloatingActionButton.module.scss";
import { forwardRef } from "react";
import BaseButton from "./BaseButton";

const FloatingActionButton = forwardRef((props, ref) => {
  const classname = `${styles.floatingAction} ${styles.iconOnly} ${
    props.ctrCls
  } ${props.iconOutlined ? styles.outlined : ""} `;

  const renderActionIcon = () => {
    if (props.icon && typeof props.icon === "function") {
      return props.icon();
    }
    return (
      <span className={`${styles.iconContainer}`}>
        <AddIcon />
      </span>
    );
  };

  return (
    <BaseButton
      {...props}
      label={""}
      ctrCls={classname}
      icon={renderActionIcon}
      ref={ref}
      isIconOnlyStylesApplied={true}
    />
  );
});

FloatingActionButton.displayName = "FloatingActionButton";

FloatingActionButton.propTypes = {
  ...BaseButton.propTypes,
};

FloatingActionButton.defaultProps = {
  onClick: () => undefined,
  ctrCls: "",
  icon: null,
  iconOutlined: false,
};

export default FloatingActionButton;
