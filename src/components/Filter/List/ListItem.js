import PropTypes from "prop-types";
import { Checkbox } from "../../Checkbox";
import listStyles from "./List.module.scss";

function ListItem({ value, label, onChange, isSelected, isDisabled, index }) {
  const _onChange = (e, isChecked) => {
    onChange(e, {
      item: {
        value,
        label,
      },
      isChecked,
      index,
    });
  };

  return (
    <div
      className={`${listStyles.item} ${
        isSelected ? listStyles.isSelected : ""
      } ${isDisabled ? listStyles.disabled : ""}`}
      role="listitem"
    >
      <Checkbox
        isChecked={isSelected}
        label={label}
        uniqueId={`${1670336154670}-${value}`}
        ctrCls={listStyles.checkbox}
        onChange={_onChange}
        isDisabled={isDisabled}
      />
    </div>
  );
}

ListItem.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  isSelected: PropTypes.bool,
  index: PropTypes.number,
};

export default ListItem;
