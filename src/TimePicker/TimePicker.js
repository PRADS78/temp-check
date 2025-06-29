import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import TimeKeep from "react-timekeeper";

import AppButton from "../AppButton/AppButton";
import AppIcon from "../AppIcon/AppIcon";
import "./TimePicker.scss";

/**
 * @deprecated
 */
const TimePicker = ({
  hour24Mode,
  openDefault,
  selectTime,
  time,
  label,
  name,
  ctrCls,
  disabled,
}) => {
  const [showTime, setShowTime] = useState(openDefault);

  const [tempTime, setTempTime] = useState(time);
  const [finalTime, setFinalTime] = useState(time);

  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref, onClick) {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowTime(false);
      }
    }

    useEffect(() => {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);
  }

  useOutsideAlerter(wrapperRef);

  return (
    <div className={"time-keeper-wrap " + ctrCls} ref={wrapperRef}>
      <div className="time-input">
        {!!label && <label>{label}</label>}
        <input
          type="text"
          value={finalTime || ""}
          name={name}
          onFocus={() => setShowTime(true)}
          readOnly
          disabled={disabled}
        />
        {!disabled && (
          <AppIcon
            ctrCls="timepicker-img"
            iconCls="icon-clock"
            onClick={() => setShowTime(true)}
          />
        )}
      </div>
      {!!showTime && (
        <TimeKeep
          time={tempTime || ""}
          onChange={(newTime) =>
            setTempTime(hour24Mode ? newTime.formatted24 : newTime.formatted12)
          }
          switchToMinuteOnHourSelect
          hour24Mode={hour24Mode}
          forceCoarseMinutes
          doneButton={(newTime) => (
            <div className="time-submit">
              <AppButton
                buttonLabel="OK"
                type="plain"
                clickHandler={() => {
                  setFinalTime(tempTime);
                  setShowTime(false);
                  selectTime(tempTime);
                }}
              />
              <AppButton
                buttonLabel="CANCEL"
                type="plain"
                clickHandler={() => {
                  setShowTime(false);
                  setTempTime(finalTime);
                }}
              />
            </div>
          )}
        />
      )}
    </div>
  );
};

TimePicker.defaultProps = {
  ctrCls: "",
  selectTime: () => {},
  name: "time",
  hour24Mode: false,
  openDefault: false,
  time: "12:00",
  disabled: false,
  label: "Time picker",
};

TimePicker.propTypes = {
  /**
   * Specify ctrCls for the chackbox parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * selectTime is a function provides the time keeper value when change action performs
   */
  selectTime: PropTypes.func.isRequired,
  /**
   * time prop set the value for the TimePicker
   */
  time: PropTypes.string.isRequired,
  /**
   * define disable state for the TimePicker
   */
  disabled: PropTypes.bool,
  /**
   * define name for the input indentity
   */
  name: PropTypes.string,
  /**
   * define hour24Mode state for the TimePicker time format
   */
  hour24Mode: PropTypes.bool,
  /**
   * define openDefault state for the TimePicker clock open as default
   */
  openDefault: PropTypes.bool,
};

export default TimePicker;
