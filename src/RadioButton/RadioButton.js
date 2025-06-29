/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./RadioButton.scss";

/**
 * @deprecated
 */
const RadioButton = ({ radioGroups, value, onRadioChange, ctrCls }) => {
  const [val, setVal] = useState(null);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const onChange = (e, i) => {
    setVal(radioGroups[i].id);
    onRadioChange(e, radioGroups[i]);
  };
  return (
    <div className={ctrCls}>
      {radioGroups.map((el, i) => {
        return (
          <div className="custom-radio" key={i}>
            <input
              id={el.id}
              type="radio"
              name={el.name}
              value={val || el.id}
              checked={val === el.id}
              onChange={(e) => onChange(e, i)}
            />
            <label htmlFor={el.id}>{el.label}</label>
          </div>
        );
      })}
    </div>
  );
};

RadioButton.defaultProps = {
  ctrCls: "",
  radioGroups: [
    { label: "Option 1", name: "option", id: "option1" },
    { label: "Option 2", name: "option", id: "option2" },
  ],
  onRadioChange: () => {},
};

RadioButton.propTypes = {
  /**
   * Specify ctrCls for the radio group class name
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the array of values with label text, input name(should be same) and input id(should be unique).
   */
  radioGroups: PropTypes.array,
  /**
   * onRadioChange it's function for the radio button onChange method
   */
  onRadioChange: PropTypes.func,
};

export default RadioButton;
