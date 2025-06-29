import { useCallback } from "react";
import styles from "./ClearButton.module.scss";
import PropTypes from "prop-types";
import { SearchCloseIcon } from "../../../../Icons";
import actionTypes from "../../state/actionTypes";
import { useDropDownContext } from "../../hooks";

function ClearButton(props) {
  const { onChange } = props;
  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch } = context;

  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      dropDownDispatch({
        type: actionTypes.CLEAR_ALL,
        payload: { filteredItems: [...props.menuItems] },
      });
      dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
      onChange([]);
    },
    [dropDownDispatch, props.menuItems, onChange]
  );

  return (props.isClearable &&
    props.isMulti &&
    dropDownState.checkedItems.length >= 1) ||
    (!!dropDownState.searchText && dropDownState.active) ? (
    <SearchCloseIcon
      className={styles.clearButton}
      onClick={onClick}
      uniqueId={1667217445200}
      isDisabled={props.isDisabled}
    />
  ) : null;
}

ClearButton.propTypes = {
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default ClearButton;
