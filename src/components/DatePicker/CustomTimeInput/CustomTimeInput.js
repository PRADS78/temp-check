import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import styles from "./CustomTimeInput.module.scss";
import PropTypes from "prop-types";
import moment from "moment";
import { Slider } from "./Slider";
import { Accordion } from "../../../Animation";
import { useWindowClick } from "../../../hooks";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
function CustomTimeInput(props) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const { setIsTimePickerActive } = props;
  const hourRef = useRef();
  const minuteRef = useRef();
  const meridiemRef = useRef();
  const timePickerRef = useRef();
  const [sliderReRenderKey, setSliderReRenderKey] = useState(0);

  useWindowClick(
    useCallback(
      (event) => {
        const timePickerComponent = event.target.closest(
          `.${styles.timePicker}`
        );
        const timeInput = event.target.closest(`
          .${styles.customTimeInput}
        `);
        if (!timePickerComponent && !timeInput) {
          setIsTimePickerActive(false);
        }
      },
      [setIsTimePickerActive]
    )
  );

  useEffect(function initializeSliders() {
    // forces the sliders to re-render after the component template is mounted
    // forgoing this will cause the sliders to show incorrect initial slides
    setSliderReRenderKey(Date.now());
  }, []);

  const timePickerHidden = useMemo(() => {
    return !props.isActive ? styles.timePickerHidden : "";
  }, [props.isActive]);

  const initialSlideIndices = useMemo(() => {
    const currentDate =
      props.date.toString() === "Invalid Date" ? new Date() : props.date;
    return {
      hour: Number(moment(currentDate).format("h")),
      minute: Number(moment(currentDate).format("m")),
      meridiem: moment(currentDate).format("A") === "AM" ? 0 : 1,
    };
  }, [props.date]);

  const hours = useMemo(() => {
    return [...Array(12).keys()].map((_, index) => {
      const active =
        index + 1 === Number(initialSlideIndices.hour) ? styles.active : "";
      return (
        <div
          className={`${styles.hourOption} ${active} ${timePickerHidden}`}
          key={`hours-${index}`}
          onClick={() => hourRef.current.slickGoTo(index)}
        >
          {index + 1}
        </div>
      );
    });
  }, [initialSlideIndices, timePickerHidden]);

  const minutes = useMemo(() => {
    return [...Array(60).keys()].map((_, index) => {
      const active =
        index === Number(initialSlideIndices.minute) ? styles.active : "";
      return (
        <div
          className={`${styles.minuteOption} ${active} ${timePickerHidden}`}
          key={`minutes-${index}`}
          onClick={() => minuteRef.current.slickGoTo(index)}
        >
          {index < 10 ? `0${index}` : index}
        </div>
      );
    });
  }, [initialSlideIndices, timePickerHidden]);

  const meridiem = useMemo(() => {
    return [...Array(6).keys()].map((_, index) => (
      <div
        className={`${styles.meridiemOption} ${timePickerHidden}`}
        key={`meridiem-${index}`}
        onClick={() => meridiemRef.current.slickGoTo(index)}
      >
        {index % 2 === 0 ? "AM" : "PM"}
      </div>
    ));
  }, [timePickerHidden]);

  const getHourInTwelveHourFormat = ({ activeHour }) => {
    let currentDate =
      props.date.toString() === "Invalid Date" ? new Date() : props.date;
    let meridiem = moment(currentDate).format("A") === "AM" ? 0 : 1;
    let updatedHour;
    // 0 is AM; 1 is PM
    if (meridiem === 0) {
      if (activeHour === 12) {
        updatedHour = 0;
      } else {
        updatedHour = activeHour;
      }
    } else {
      if (activeHour === 12) {
        updatedHour = 12;
      } else {
        updatedHour = activeHour + 12;
      }
    }

    return updatedHour;
  };

  const onHourChange = (activeIndex) => {
    let activeHour = activeIndex + 1;
    let updatedHour = getHourInTwelveHourFormat({ activeHour });
    props.onChange(`${updatedHour}:${props.date.getMinutes()}`);
  };

  const onMinuteChange = (activeIndex) => {
    let activeHour = Number(moment(props.date).format("h"));
    let updatedHour = getHourInTwelveHourFormat({ activeHour });
    const updatedMinute =
      activeIndex <= 9 ? `0${activeIndex}` : `${activeIndex}`;

    props.onChange(`${updatedHour}:${updatedMinute}`);
  };

  const onMeridiemChange = (activeIndex) => {
    let meridiem = activeIndex % 2 === 0 ? 0 : 1;
    let activeHour = Number(moment(props.date).format("H"));
    let activeMinute = initialSlideIndices.minute;
    if (meridiem === 0) {
      activeHour += 12;
    } else {
      activeHour -= 12;
    }
    props.onChange(`${activeHour}:${activeMinute}`);
  };

  return (
    <div
      className={`${styles.customTimeInput} `}
      role="region"
      data-role="custom-time-picker"
      data-dz-unique-id={`${props.automationIdPrefix}-1669211764603-time-picker-date-picker`}
    >
      <button
        className={`${props.isActive ? styles.customTimeInputActiveState : ""}`}
        onClick={() => props.setIsTimePickerActive(!props.isActive)}
      >
        {props.date.toString() === "Invalid Date"
          ? t("datePicker.selectDateWarning")
          : moment(props.date).format("h:mm A")}
      </button>
      <Accordion
        contentRef={timePickerRef}
        expanded={props.isActive}
        customClass={styles.timePickerAccordion}
      >
        <div ref={timePickerRef} className={styles.timePicker}>
          <div className={styles.highlightBar}></div>
          <Slider
            key={`slide-hour-${sliderReRenderKey}`}
            ref={hourRef}
            centerMode={false}
            centerPadding="30px"
            customClass={styles.hourSlider}
            initialSlide={initialSlideIndices.hour - 1}
            onChange={onHourChange}
            slides={hours}
            slidesToShow={3}
          />
          <Slider
            key={`slide-minute-${sliderReRenderKey}`}
            ref={minuteRef}
            centerMode={true}
            centerPadding="42px"
            customClass={styles.minuteSlider}
            initialSlide={initialSlideIndices.minute}
            onChange={onMinuteChange}
            slides={minutes}
            slidesToShow={1}
          />
          <Slider
            key={`slide-meridiem-${sliderReRenderKey}`}
            ref={meridiemRef}
            centerMode={false}
            centerPadding="30px"
            customClass={styles.meridiemSlider}
            initialSlide={initialSlideIndices.meridiem}
            onChange={onMeridiemChange}
            slides={meridiem}
            slidesToShow={3}
          />
          <div className={styles.meridiemLowerCover}></div>
        </div>
      </Accordion>
    </div>
  );
}

CustomTimeInput.propTypes = {
  date: PropTypes.any,
  isActive: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  setIsTimePickerActive: PropTypes.func,
  automationIdPrefix: PropTypes.string.isRequired,
};

export default CustomTimeInput;
