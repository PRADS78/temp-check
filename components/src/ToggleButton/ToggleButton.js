import PropTypes from "prop-types";

import "./ToggelButton.scss";

/**
 * @deprecated
 */
const ToggleButton = ({ disabled, ctrCls, onChange, checked, name }) => {
  return (
    <div className={"toggle-btn " + ctrCls}>
      <label className="switch">
        <input
          type="checkbox"
          disabled={disabled}
          onChange={onChange}
          checked={checked}
          name={name}
        />
        <span className="slider-box" />
      </label>
    </div>
  );
};

ToggleButton.defaultProps = {
  ctrCls: "",
  onChange: () => {},
  disabled: false,
  checked: false,
  name: "toggle",
};

ToggleButton.propTypes = {
  /**
   * Specify ctrCls for the chackbox parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * onChange is a function provides the toggle button value when change action performs
   */
  onChange: PropTypes.func.isRequired,
  /**
   * define disable state for the toggle button
   */
  disabled: PropTypes.bool,
  /**
   * define name for the input indentity
   */
  name: PropTypes.string,
  /**
   * define checked state for the toggle button
   */
  checked: PropTypes.bool.isRequired,
};

export default ToggleButton;
