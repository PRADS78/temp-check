import { forwardRef, useMemo } from "react";
import styles from "./CustomInput.module.scss";
import PropTypes from "prop-types";
import { DatePickerCalendarIcon } from "../../../Icons";

const CustomInput = forwardRef(function (props, ref) {
  const renderBlinker = useMemo(() => {
    if (!props.calendarVisible) return null;
    return <div className={styles.blinker}></div>;
  }, [props.calendarVisible]);

  return (
    <div
      className={`
        ${styles.customInput}
        ${props.calendarVisible ? styles.calendarVisible : ""}
      `}
      onClick={props.onInputClick}
      data-dz-unique-id={`${props.automationIdPrefix}-1669211810379-input-date-picker`}
    >
      <div className={styles.inputGroup}>
        <input
          disabled={props.isDisabled}
          name={props.inputName}
          placeholder={props.placeholder}
          type="text"
          ref={ref}
          value={props.value}
          readOnly
        />
        {renderBlinker}
        <DatePickerCalendarIcon
          className={styles.iconContainer}
          data-name="calendar-icon"
          isDisabled={props.isDisabled}
        />
      </div>
    </div>
  );
});
CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  isDisabled: PropTypes.bool,
  inputName: PropTypes.string,
  calendarVisible: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onInputClick: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  automationIdPrefix: PropTypes.string,
};

CustomInput.defaultProps = {
  inputName: "date",
};

export default CustomInput;
