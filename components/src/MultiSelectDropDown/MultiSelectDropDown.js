/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "react-multi-select-component";
import Checkbox from "../Checkbox/Checkbox";
import "./MultiSelectDropDown.scss";

/**
 * @deprecated
 */
const MultiSelectDropDown = ({
  ctrCls,
  items,
  values,
  onSelect,
  placeholder,
  disableSearch,
  disabled,
  overrideStrings
}) => {
  const [selected, setSelected] = useState([]);

  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  };

  useEffect(() => {
    setSelected([...values]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ItemRenderer = ({ checked, option, onClick, disabled }) => {
    return (
      <Checkbox
        key={option.label}
        label={option.label}
        value={checked}
        name={option.label}
        onChange={onClick}
      />
    );
  };

  const valueRenderer = (selected, options) => {
    return selected.length
      ? selected.map((element, i) =>
          i === 0 ? element.label : `, ${element.label}`
        )
      : placeholder;
  };

  const onValueSelect = (value) => {
    setSelected([...value]);
    onSelect([...value]);
  };

  return (
    <MultiSelect
      className={`multi-select-container ${ctrCls}`}
      options={items}
      disableSearch={disableSearch}
      disabled={disabled || false}
      filterOptions={filterOptions}
      value={values || []}
      onChange={onValueSelect}
      labelledBy="Select"
      ItemRenderer={ItemRenderer}
      valueRenderer={valueRenderer}
      overrideStrings={overrideStrings}
    />
  );
};

MultiSelectDropDown.propTypes = {
  /**
   * Specify ctrCls for the multi select drop down parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the list of dropdown items to make the dropdown values
   */
  items: PropTypes.array.isRequired,
  /**
   * Specify the value prop for the dropdown
   */
  values: PropTypes.any.isRequired,
  /**
   * Specify the onSelect function is selection function for the dropdown
   */
  onSelect: PropTypes.func.isRequired,
  /**
   * Specify the placeholder text for the dropdown
   */
  placeholder: PropTypes.string,
  /**
   * Specify the disableSearch as true/false to display search search textbox
   */
  disableSearch: PropTypes.bool,
  /**
   * Specify the disable as true/false to access dropdown items
   */
  disabled: PropTypes.bool,
  /**
   * Specify the overrideStrings as object to override the default strings (Ref doc - https://github.com/hc-oss/react-multi-select-component/blob/master/stories/recipes/localization.stories.mdx)
   */
  overrideStrings: PropTypes.object
};

MultiSelectDropDown.defaultProps = {
  ctrCls: "",
  items: [],
  values: [],
  onSelect: () => {},
  placeholder: "Select...",
  disableSearch: false,
  disabled: false,
  overrideStrings: {}
};

export default MultiSelectDropDown;
