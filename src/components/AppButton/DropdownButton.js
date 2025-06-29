import PropTypes from "prop-types";
import { WobbleRotate } from "../../Animation";
import { DownArrowIcon } from "../../Icons";
import BaseButton from "./BaseButton";
import styles from "./BaseButton.module.scss";
import { forwardRef, useRef, useState } from "react";
import { Menu } from "../SimpleMenu";
import { SimpleMenuPositions } from "../../Enums";

const DropdownButton = forwardRef((props, ref) => {
  const localButtonRef = useRef(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const renderButtonIcon = () => {
    return (
      <WobbleRotate in={isMenuVisible}>
        <DownArrowIcon
          className={`${styles.dropdownIcon}`}
          canRenderOnlyIcon
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuVisible((prevState) => !prevState);
          }}
          role="button"
          uniqueId={1669208884299}
        />
      </WobbleRotate>
    );
  };

  function renderButtonMenu() {
    return (
      <>
        <span className={styles.divider}></span>
        <Menu
          buttonClass={styles.appButton}
          isVisible={isMenuVisible}
          onChangeVisibility={setIsMenuVisible}
          items={props.menuItems}
          onItemClick={props.onMenuItemClick}
          uniqueId={1669207406328}
          referenceRef={ref ?? localButtonRef.current}
          popperCtrCls={props.menuCtrCls}
          canUsePortal={true}
          position={props.position}
        />
      </>
    );
  }

  return (
    <>
      <BaseButton
        {...props}
        ctrCls={`${styles.dropDown} ${props.ctrCls ?? ""}`}
        renderButtonMenu={renderButtonMenu}
        icon={renderButtonIcon}
        ref={ref ?? localButtonRef}
      />
    </>
  );
});

DropdownButton.displayName = "DropdownButton";

DropdownButton.propTypes = {
  /**
   * Items for the drop down menu for the drop down app button type
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  /**
   * The callback function invoked when clicking menu items
   */
  onMenuItemClick: PropTypes.func,
  /**
   * The class name for the menu container
   */
  menuCtrCls: PropTypes.string,
  /**
   * Portal the menu to the body
   */
  canUsePortal: PropTypes.bool,
  /**
   * The position of the menu
   */
  position: PropTypes.oneOf(Object.values(SimpleMenuPositions)),
  // Only works for ESLINT
  ...BaseButton.propTypes,
};

DropdownButton.defaultProps = {
  menuItems: [],
  onMenuItemClick: () => undefined,
  menuCtrCls: "",
  canUsePortal: false,
  position: SimpleMenuPositions.BOTTOM_END,
};

export default DropdownButton;
