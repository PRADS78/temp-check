import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./TimePicker.module.scss";
import TimeKeeper from "react-timekeeper";
import PropTypes from "prop-types";
import { useWindowClick } from "../../hooks";
import { ClockIcon } from "../../Icons";
import { Label } from "../Label";
import { PlainButton } from "../AppButton";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { Popper } from "../Popper";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";
function TimePicker(props) {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Time Picker");
    invariantUniqueId(props.uniqueId, "Time Picker");
  }, [automationIdPrefix, props.uniqueId]);

  const inputGroupRef = useRef();
  const timeKeeperContainerRef = useRef();

  const [timeKeeperVisible, setTimeKeeperVisible] = useState(
    props.canOpenByDefault
  );
  const [tempTime, setTempTime] = useState(props.time);

  useWindowClick(
    useCallback((event) => {
      const timePickerComponent = event.target.closest(`.${styles.timePicker}`);
      const timeListElement = event.target.closest(
        ".react-timekeeper__dropdown-numbers"
      );
      if (!timePickerComponent && !timeListElement) {
        setTimeKeeperVisible(false);
      }
    }, [])
  );

  const modifiers = useMemo(() => {
    return [
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom", "top"],
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ];
  }, []);

  const activeHour = useMemo(() => {
    if (!props.time) return "00";

    let hour = Number(tempTime.split(":")[0]);
    let selectedHour;
    if (hour === 0) {
      selectedHour = 12;
    } else if (hour >= 13) {
      selectedHour = hour - 12;
    } else {
      selectedHour = hour;
    }

    // if (props.isHour24Mode && hour <= 12) {
    //   selectedHour += 12;
    // }
    return selectedHour;
  }, [props.time, tempTime]);

  const activeMinute = useMemo(() => {
    if (!props.time) return "00";

    return tempTime.replace(/([AaPp][Mm])/, "").split(":")[1];
  }, [props.time, tempTime]);

  const updateActiveHourColor = useCallback(() => {
    if (!timeKeeperContainerRef.current) {
      return;
    }
    const clockHours = timeKeeperContainerRef.current.querySelector(
      ".react-timekeeper__clock-hours"
    );
    if (!props.time) return;

    if (clockHours) {
      Array.prototype.forEach.call(clockHours.children, (hourChild, index) => {
        hourChild.classList.remove(styles.activeHour);
        if (index === activeHour - 1) {
          hourChild.classList.add(styles.activeHour);
          hourChild.classList.remove(styles.inactiveHour);
        } else {
          hourChild.classList.remove(styles.activeHour);
          hourChild.classList.add(styles.inactiveHour);
        }
      });
    }
  }, [activeHour, props.time]);

  const updateActiveMinuteColor = useCallback(() => {
    if (!timeKeeperContainerRef.current) {
      return;
    }
    const clockMinutes = timeKeeperContainerRef.current.querySelector(
      ".react-timekeeper__clock-minutes"
    );
    if (!props.time) return;
    if (clockMinutes) {
      Array.prototype.forEach.call(clockMinutes.children, (minChild, index) => {
        let minuteIndex =
          Number(activeMinute) === 0
            ? clockMinutes.children.length
            : Number(activeMinute) / 5;

        if (minuteIndex - 1 === index) {
          minChild.classList.add(styles.activeMinute);
          minChild.classList.remove(styles.inactiveMinute);
        } else {
          minChild.classList.remove(styles.activeMinute);
          minChild.classList.add(styles.inactiveMinute);
        }
      });
    }
  }, [activeMinute, props.time]);

  useEffect(
    function updateCenterCircleRadius() {
      if (!timeKeeperContainerRef.current) {
        return;
      }
      const picker = timeKeeperContainerRef.current;
      const clockCenterCircle = picker.querySelector(
        ".react-timekeeper__hand-circle-center"
      );
      if (clockCenterCircle) {
        clockCenterCircle.setAttribute("r", 3);
      }
    },
    [timeKeeperVisible]
  );

  useEffect(
    function bindTopBarHourAndMinute() {
      if (!timeKeeperContainerRef.current) {
        return;
      }
      let animationFrameId = null;
      const onClickHourOrMinute = () => {
        animationFrameId = requestAnimationFrame(() => {
          if (timeKeeperContainerRef.current && timeKeeperVisible) {
            updateActiveHourColor();
            updateActiveMinuteColor();
          }
        });
      };

      const topBarHour = timeKeeperContainerRef.current.querySelector(
        ".react-timekeeper__tb-hour"
      );
      const topBarMinute = timeKeeperContainerRef.current.querySelector(
        ".react-timekeeper__tb-minute"
      );

      if (topBarHour && topBarMinute) {
        topBarHour.addEventListener("click", onClickHourOrMinute);
        topBarMinute.addEventListener("click", onClickHourOrMinute);
      }
      return () => {
        if (topBarHour && topBarMinute) {
          topBarHour.removeEventListener("click", onClickHourOrMinute);
          topBarMinute.removeEventListener("click", onClickHourOrMinute);
        }
        cancelAnimationFrame(animationFrameId);
      };
    },
    [updateActiveHourColor, updateActiveMinuteColor, timeKeeperVisible]
  );

  useEffect(
    function activeHourAndMinuteColorUpdate() {
      updateActiveHourColor();
      updateActiveMinuteColor();
    },
    [updateActiveHourColor, updateActiveMinuteColor, timeKeeperVisible]
  );

  const onChangeTime = (time) => {
    setTempTime(time.formatted12);
  };

  const onOkButtonClick = () => {
    props.onOkay(tempTime);
    setTimeKeeperVisible(false);
  };

  const onCancelButtonClick = () => {
    props.onCancel();
    setTimeKeeperVisible(false);
  };

  const onInputIconGroupClick = () => {
    setTimeKeeperVisible(!timeKeeperVisible);
  };

  return (
    <div
      className={`${styles.timePicker} ${props.ctrCls} ${
        props.label.length === 0 ? styles.withoutLabel : ""
      }
      `}
      role="region"
      data-role="root-element"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-time-picker`}
    >
      <div className={styles.inputGroup} ref={inputGroupRef}>
        {props.label ? (
          <Label
            text={props.label}
            ctrCls={styles.label}
            uniqueId={1667226320323}
          />
        ) : null}
        <div
          className={`${styles.inputIconGroup} ${
            timeKeeperVisible ? styles.highLighted : ""
          }`}
          onClick={onInputIconGroupClick}
          role="button"
          data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-input-time-picker`}
        >
          <input
            disabled={props.isDisabled}
            name={props.name}
            type="text"
            readOnly
            value={props.time || ""}
            placeholder={props.placeholder}
          />
          <ClockIcon className={styles.iconContainer} />
        </div>
      </div>
      <Popper
        isVisible={timeKeeperVisible}
        innerCtrCls={styles.timeKeeperAccordion}
        referenceElement={inputGroupRef.current}
        onClickOutside={onCancelButtonClick}
        modifiers={modifiers}
        isPortal={props.canUsePortal}
      >
        <div
          className={styles.timeKeeperContainer}
          ref={timeKeeperContainerRef}
        >
          <div className={styles.colons}>
            <div></div>
            <div></div>
          </div>
          <TimeKeeper
            isHour24Mode={false}
            time={tempTime}
            onChange={onChangeTime}
            doneButton={() => (
              <div className={styles.doneButtons}>
                <PlainButton
                  label={t("common.cancel")}
                  onClick={onCancelButtonClick}
                  ctrCls={`${styles.footerButton} ${styles.cancelButton}`}
                  uniqueId={1667215965378}
                />
                <PlainButton
                  label={t("common.ok")}
                  onClick={onOkButtonClick}
                  ctrCls={`${styles.footerButton} ${styles.okButton}`}
                  uniqueId={1667215974664}
                />
              </div>
            )}
          />
        </div>
      </Popper>
    </div>
  );
}

TimePicker.propTypes = {
  /**
   * Container class name for TimePicker
   */
  ctrCls: PropTypes.string,
  /**
   * onOkay callback function
   */
  onOkay: PropTypes.func.isRequired,
  /**
   * onCancel callback function
   */
  onCancel: PropTypes.func, // TEST
  /**
   * Time to show in the input
   */
  time: PropTypes.string.isRequired,
  /**
   * Boolean to determine if the Time picker is disabled
   */
  isDisabled: PropTypes.bool, // TODO
  /**
   * Name for the input element
   */
  name: PropTypes.string, // TODO
  /**
   * Boolean to determine if the Time picker is in 24 hour mode
   */
  isHour24Mode: PropTypes.bool, // TEST
  /**
   * Boolean to determine if the Time picker is visible by default
   */
  canOpenByDefault: PropTypes.bool, // TODO
  /**
   * Label for the Time Picker
   */
  label: PropTypes.string, // TODO
  /**
   * Placeholder for the Time Picker
   */
  placeholder: PropTypes.string, // TEST
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Boolean to determine if the dropdown menu can be rendered in a portal to resolve z-index issues
   */
  canUsePortal: PropTypes.bool,
};

TimePicker.defaultProps = {
  ctrCls: "",
  onOkay: () => undefined,
  name: "time",
  isHour24Mode: false,
  canOpenByDefault: false,
  time: "3:00",
  isDisabled: false,
  label: "Time",
  placeholder: "Select time",
  canUsePortal: false,
};

export default TimePicker;
