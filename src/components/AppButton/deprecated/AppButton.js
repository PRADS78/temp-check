import { useState, useEffect, useRef } from "react";
import styles from "./AppButton.module.scss";
import PropTypes from "prop-types";
import { WobbleRotate } from "../../../Animation";
import { Menu } from "../../SimpleMenu";
import AppIcon from "../../../AppIcon/AppIcon";
import { AddIcon, DownArrowIcon } from "../../../Icons";
import { ButtonTypes } from "../../../Enums";
import { useAutomationIdPrefix } from "../../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../../Utils";

function AppButton(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Button");
    invariantUniqueId(props.uniqueId, "Button");
  }, [automationIdPrefix, props.uniqueId]);

  const ref = useRef(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const iconOnly = props.label.length === 0 ? styles["icon-only"] : "";
  const className = `${styles["appButton"]} ${styles[props.type] || ""} ${
    props.ctrCls
  } ${iconOnly} ${styles[props.size] || ""} ${
    (props.iconCls &&
      props.type !== ButtonTypes.DROP_DOWN &&
      props.type !== ButtonTypes.FLOATING_ACTION) ||
    typeof props.icon === "function"
      ? styles.withIcon
      : ""
  }
  `;

  function renderButtonIcon() {
    if (props.icon) {
      if (typeof props.icon === "function") {
        return props.icon({ isDisabled: props.isDisabled });
      }
    }

    if (props.iconCls && props.iconCls.length) {
      switch (props.type) {
        case ButtonTypes.FLOATING_ACTION:
          return (
            <WobbleRotate in={isMenuVisible}>
              <span className={styles.iconContainer}>
                <AddIcon />
              </span>
            </WobbleRotate>
          );
        case ButtonTypes.DROP_DOWN:
          return (
            <WobbleRotate in={isMenuVisible}>
              <span className={styles.iconContainer}>
                <DownArrowIcon className={`no-hover`} />
              </span>
            </WobbleRotate>
          );
        default:
          return (
            <div className={styles.appIconContainer}>
              <AppIcon
                ctrCls={`${styles["app-icon"]}`}
                isNewIcon={props.isNewIcon}
                iconCls={props.iconCls}
                iconColor={props.iconColor}
              />
            </div>
          );
      }
    } else {
      return null;
    }
  }

  const onClick = (e) => {
    if (props.type === ButtonTypes.DROP_DOWN) {
      setIsMenuVisible(!isMenuVisible);
    }
    props.onClick(e);
  };

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={props.isDisabled}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-button`}
      ref={ref}
    >
      {props.label && <span className={styles.label}>{props.label}</span>}
      {renderButtonIcon()}
      {props.type === ButtonTypes.DROP_DOWN ? (
        <>
          <span className={styles.divider}></span>
          <Menu
            buttonClass={styles.appButton}
            isVisible={isMenuVisible}
            onChangeVisibility={setIsMenuVisible}
            items={props.menuItems}
            onItemClick={props.onMenuItemClick}
            uniqueId={1667546011164}
            referenceRef={ref.current}
          />
        </>
      ) : null}
    </button>
  );
}

AppButton.propTypes = {
  /**
   * Specify type for the button
   */
  type: PropTypes.oneOf([
    ButtonTypes.PRIMARY,
    ButtonTypes.OUTLINED,
    ButtonTypes.PLAIN,
    ButtonTypes.FLOATING_ACTION,
    ButtonTypes.DROP_DOWN,
    ButtonTypes.HYPERLINK,
  ]),
  /**
   * Specifies the label for the button
   */
  label: PropTypes.string,
  /**
   * Container class for the button
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the button icon class name
   */
  iconCls: PropTypes.string,
  /**
   * Experimental (Do not use)
   */
  isNewIcon: PropTypes.bool,
  /**
   * Specifies the title for the button which serves as its tooltip
   */
  tooltipText: PropTypes.string,
  /**
   * Determines the "disabled" attribute of the button
   */
  isDisabled: PropTypes.bool,
  /**
   * Adds an onClick event listener to the button
   */
  onClick: PropTypes.func,
  /**
   * Color of the button's icon
   */
  iconColor: PropTypes.string,
  /**
   * Items for the drop down menu for the drop down app button type
   */
  menuItems: PropTypes.arrayOf(PropTypes.object),
  /**
   * The callback function invoked when clicking menu items
   */
  onMenuItemClick: PropTypes.func,
  /**
   * Sets the size of the button
   */
  size: PropTypes.oneOf(["regular", "small", "end-to-end"]),
  /**
   * Accepts an icon component from the project @disprz/icons
   *
   * Example:
   *
   * ```js
   * function renderButton(){
   *  return <AppButton type={ButtonTypes.PRIMARY} icon={()=>{
   *    <SearchIcon canRenderOnlyIcon className="search stroke" />;
   *  }}/>
   * }
   * ```
   *
   * - 'stroke' Pass this class when your icon requires stoke
   * - 'fill' Pass this class when your icon requires fill
   */
  icon: PropTypes.func,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

AppButton.defaultProps = {
  onClick: () => undefined,
  type: ButtonTypes.PRIMARY,
  ctrCls: "",
  size: "regular",
  label: "",
  menuItems: [],
  onMenuItemClick: () => undefined,
  isDisabled: false,
  iconCls: "",
  icon: null,
};

export default AppButton;
