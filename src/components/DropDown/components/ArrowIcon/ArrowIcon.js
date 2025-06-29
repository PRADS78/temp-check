import styles from "./ArrowIcon.module.scss";
import { DownArrowIcon } from "../../../../Icons";
import { WobbleRotate } from "../../../../Animation";
// hooks
import { useDropDownContext } from "../../hooks";
import PropTypes from "prop-types";

function ArrowIcon(props) {
  const context = useDropDownContext();
  const { dropDownState } = context;
  const activeStyle = dropDownState.active ? styles.active : "";
  const disabledStyle = props.isDisabled ? styles.disabled : "";
  return (
    <div className={`${styles.arrowIcon} ${activeStyle} ${disabledStyle}`}>
      <WobbleRotate in={context.dropDownState.active}>
        <DownArrowIcon className={styles.arrow} isDisabled={props.isDisabled} />
      </WobbleRotate>
    </div>
  );
}

ArrowIcon.propTypes = {
  isDisabled: PropTypes.bool,
};

export default ArrowIcon;
