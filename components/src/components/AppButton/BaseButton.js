import styles from "./BaseButton.module.scss";
import PropTypes from "prop-types";
import { ButtonSize } from "../../Enums";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { forwardRef } from "react";
import Badges from "../Badges/Badges";

const BaseButton = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Button");
    invariantUniqueId(props.uniqueId, "Button");
  }, [automationIdPrefix, props.uniqueId]);

  const stylesWithIcon =
    typeof props.icon === "function" &&
    typeof props.renderButtonMenu !== "function" &&
    !props.isIconOnlyStylesApplied
      ? styles.withIcon
      : "";

  const className = `${styles.appButton} ${props.ctrCls} ${stylesWithIcon}
  ${styles[props.size] || ""} `;

  const onClick = (e) => {
    props.onClick(e);
  };

  const renderButtonIcon = () => {
    if (props.icon && typeof props.icon === "function") {
      return props.icon({ isDisabled: props.isDisabled });
    }
  };

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={props.isDisabled}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-button`}
      ref={ref}
      title={props.tooltipText}
    >
      {renderButtonIcon()}
      {props.label && <span className={styles.label}>{props.label}</span>}
      {!!props.count && (
        <Badges
          count={props.count}
          uniqueId={1671378279418}
          isInline
          ctrCls={styles.badges}
        />
      )}
      {typeof props.renderButtonMenu === "function" && props.renderButtonMenu()}
    </button>
  );
});

BaseButton.displayName = "BaseButton";

BaseButton.propTypes = {
  /**
   * Specifies the label for the button
   */
  label: PropTypes.string,
  /**
   * Container class for the button
   */
  ctrCls: PropTypes.string,
  /**
   * Determines the "disabled" attribute of the button
   */
  isDisabled: PropTypes.bool,
  /**
   * Adds an onClick event listener to the button
   */
  onClick: PropTypes.func,
  /**
   * Sets the size of the button
   */
  size: PropTypes.oneOf([
    ButtonSize.REGULAR,
    ButtonSize.SMALL,
    ButtonSize.END_TO_END,
  ]),
  /**
   * Accepts an icon component from the project @disprz/icons
   *
   * Example:
   *
   * ```js
   * function renderButton(){
   *  return <PrimaryButton icon={() =>
   *    <SearchIcon canRenderOnlyIcon className="search stroke" />
   *  }/>
   * }
   * ```
   *
   * - 'stroke' Pass this class when your icon requires stoke
   * - 'fill' Pass this class when your icon requires fill
   */
  icon: PropTypes.func,
  /**
   * (For internal use only) This props is used to render the Menu
   */
  renderButtonMenu: PropTypes.func,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Specifies the tooltipText for the button
   */
  tooltipText: PropTypes.string,
  /**
   * Specifies the count for the button (This will render the Badges component)
   */
  count: PropTypes.number,
  /**
   * (For internal use only)
   */
  isIconOnlyStylesApplied: PropTypes.bool,
};

BaseButton.defaultProps = {
  onClick: () => undefined,
  ctrCls: "",
  size: ButtonSize.REGULAR,
  label: "",
  isDisabled: false,
  icon: null,
  renderButtonMenu: null,
  tooltipText: "",
  isIconOnlyStylesApplied: false,
};

export default BaseButton;
