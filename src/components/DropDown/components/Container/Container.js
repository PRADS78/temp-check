import styles from "./Container.module.scss";
import { useDropDownContext } from "../../hooks";
import actionTypes from "../../state/actionTypes";
import PropTypes from "prop-types";

function Container(props) {
  const context = useDropDownContext();
  const { dropDownState, containerRef } = context;
  const activeStyle = dropDownState.active ? styles.active : "";
  const disabledStyle = props.isDisabled ? styles.disabled : "";
  const paddedStyle =
    props.isSearchable && dropDownState.active ? styles.padded : "";

  const onClick = () => {
    if (props.isDisabled) return;
    if (context.dropDownState.active) {
      context.dropDownDispatch({
        type: actionTypes.HIDE_DROP_DOWN,
        payload: {
          menuItems: props.items,
        },
      });
    } else {
      context.dropDownDispatch({ type: actionTypes.SHOW_DROP_DOWN });
    }
  };

  return (
    <div
      ref={containerRef}
      name={props.name}
      className={`${props.dropDownClass} ${activeStyle} ${disabledStyle} ${paddedStyle} ${props.ctrCls}
      `}
      onClick={onClick}
      role="menu"
      data-dz-unique-id={`${props.automationIdPrefix}-${props.uniqueId}-dropdown`}
    >
      {props.children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.any,
  ctrCls: PropTypes.string,
  dropDownClass: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSearchable: PropTypes.bool,
  name: PropTypes.string,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  automationIdPrefix: PropTypes.string.isRequired,
  items: PropTypes.array,
};

export default Container;
