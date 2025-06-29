import PropTypes from "prop-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { Size, SliderTypes } from "../../Enums";
import styles from "./Slider.module.scss";
import {
  motion,
  useMotionValue,
  useVelocity,
  useTransform,
} from "framer-motion";

const smallThumbSize = 12;
const largeThumbSize = 24;
const topProgressIndicatorSize = 26;
const sliderContainerHeight = 26;

const Slider = (props) => {
  const [sliderValue, setSliderValue] = useState(
    props.defaultValue || props.min || props.start
  );
  const [containerRef, setContainerRef] = useState();
  const rangeRef = useRef();
  const sliderValueRef = useRef();
  const { onChange } = props;

  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);

  const scale = useTransform(xVelocity, [-500, 0, 500], [1.7, 1, 1.7], {
    clamp: true,
  });

  const rotate = useTransform(xVelocity, [-500, 0, 500], [30, 0, -30], {
    clamp: true,
  });

  useEffect(() => {
    if (containerRef?.offsetWidth) onRangeSlider();
  }, [containerRef, onRangeSlider]);

  const calculateTranslateXForValue = useCallback(
    (sliderValue) => {
      const containerWidth = containerRef?.offsetWidth;
      if (containerWidth) {
        const _sliderValue =
          props.type == SliderTypes.DISCRETE
            ? sliderValue - props.multiplier
            : sliderValue;
        switch (props.size) {
          case Size.LARGE:
            return (
              _sliderValue *
                (containerWidth / 100) *
                ((containerWidth - largeThumbSize) / containerWidth) +
              (largeThumbSize / 2 - topProgressIndicatorSize / 2)
            );
          case Size.SMALL:
            return (
              _sliderValue *
                (containerWidth / 100) *
                ((containerWidth - smallThumbSize) / containerWidth) +
              (smallThumbSize / 2 - topProgressIndicatorSize / 2)
            );
        }
      } else return 0;
    },
    [containerRef?.offsetWidth, props.multiplier, props.size, props.type]
  );

  const generateRangeSteps = () => {
    let rangeStep = [];
    let i = props.start;
    while (i <= props.end) {
      rangeStep.push(i);
      i = i + props.multiplier;
    }
    return rangeStep;
  };

  const _onChange = (e) => {
    const mySlider = rangeRef.current;
    let adjustedValue = e.target.value;
    if (props.min) {
      adjustedValue = Math.max(props.min, adjustedValue);
    }
    if (props.max) {
      adjustedValue = Math.min(props.max, adjustedValue);
    }
    setSliderValue(adjustedValue);
    onChange(mySlider.min, mySlider.max, mySlider.step, adjustedValue);
  };

  const onRangeSlider = useCallback(() => {
    const mySlider = rangeRef.current;
    const minValue = props.min ?? props.start;
    const maxValue = props.max ?? props.end;
    const currentVal = mySlider?.valueAsNumber;
    var maxBarX =
      calculateTranslateXForValue(Math.min(currentVal, maxValue)) +
      smallThumbSize;
    var minBarX =
      minValue <= 0 || (props.type === SliderTypes.DISCRETE && minValue == 10)
        ? 0
        : calculateTranslateXForValue(minValue) + smallThumbSize;

    const barColor = props.isDisabled ? "#A6A6A6" : "var(--accent)";

    var style = `background:-webkit-linear-gradient(
        left, 
        #A6A6A6 ${minBarX}px,
        ${barColor} ${minBarX}px, 
        ${barColor} ${maxBarX}px, 
        #A6A6A6 ${maxBarX}px 
      )`;

    mySlider.style = style;
  }, [
    calculateTranslateXForValue,
    props.end,
    props.isDisabled,
    props.max,
    props.min,
    props.start,
    props.type,
  ]);

  const renderMinMaxScale = () => {
    return [
      props.min && props.min != props.start && (
        <div
          className={styles.minScale}
          style={{
            transform: `translateX(${
              calculateTranslateXForValue(props.min) + smallThumbSize
            }px)`,
          }}
        ></div>
      ),
      props.max && props.max !== props.end && (
        <div
          className={styles.maxScale}
          style={{
            transform: `translateX(${
              calculateTranslateXForValue(props.max) + smallThumbSize
            }px)`,
          }}
        ></div>
      ),
    ];
  };
  const renderMinMaxNumbers = () => {
    return (
      <div
        className={styles.minMaxScaleNumbers}
        style={{
          top: `calc(${
            sliderContainerHeight / 2 +
            (props.size === Size.LARGE ? largeThumbSize : smallThumbSize) / 2
          }px)`,
        }}
      >
        {props.min != props.start && (
          <div
            className={styles.minScaleNumber}
            style={{
              transform: `translateX(${
                calculateTranslateXForValue(props.min) + smallThumbSize / 2
              }px)`,
              marginTop: `${props.size === Size.LARGE ? "6px" : "2px"}`,
            }}
          >
            {props.min}
          </div>
        )}
        {props.max != props.end && (
          <div
            className={styles.maxScaleNumber}
            style={{
              transform: `translateX(${
                calculateTranslateXForValue(props.max) + smallThumbSize / 2
              }px)`,
              marginTop: `${props.size === Size.LARGE ? "6px" : "2px"}`,
            }}
          >
            {props.max}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${styles.sliderContainer} ${props.ctrCls} ${
        props.size === Size.LARGE ? styles.large : ""
      } ${props.isDisabled ? styles.disabled : ""} ${
        props.type === SliderTypes.DISCRETE ? styles.discrete : ""
      }`}
      role="region"
      ref={setContainerRef}
    >
      <input
        type="range"
        min={props.start}
        max={props.end}
        step={props.multiplier}
        value={sliderValue}
        onChange={_onChange}
        onInput={onRangeSlider}
        ref={rangeRef}
        list="steps"
        className={styles.slider}
        disabled={props.isDisabled}
      />
      {props.type === SliderTypes.DISCRETE && (
        <datalist id="steps">
          {generateRangeSteps().map((val, index) => {
            return <option value={val} key={index}></option>;
          })}
        </datalist>
      )}
      {renderMinMaxScale()}
      {renderMinMaxNumbers()}
      <motion.span
        className={styles.sliderValue}
        ref={sliderValueRef}
        style={{
          originX: 0.5,
          originY: 1,
          x,
          scale,
          rotate,
        }}
        animate={{
          x: calculateTranslateXForValue(sliderValue),
        }}
      >
        <span className={styles.sliderText}>
          {sliderValue}

          <span className={styles.sliderSmallBubble}></span>
        </span>
      </motion.span>
    </div>
  );
};

Slider.propTypes = {
  /**
   * Specify ctrCls for the Slider
   */
  ctrCls: PropTypes.string,
  /**
   * Specify type of the Slider
   */
  type: PropTypes.oneOf([SliderTypes.CONTINUOUS, SliderTypes.DISCRETE]),
  /**
   * Specify size for the Slider
   */
  size: PropTypes.oneOf([Size.SMALL, Size.LARGE]),
  /**
   * Specify isDisabled for Slider
   */
  isDisabled: PropTypes.bool,
  /**
   * Specify start(min) range of the  Slider
   */
  start: PropTypes.arrayOf(PropTypes.number),
  /**
   * Specify end(max) range of the Slider
   */
  end: PropTypes.arrayOf(PropTypes.number),
  /**
   * Specify min range of the  Slider
   */
  min: PropTypes.number,
  /**
   * Specify max range of the Slider
   */
  max: PropTypes.number,
  /**
   * Specify multiplier(step) of the Slider
   */
  multiplier: PropTypes.number,
  /**
   * Specify default value of the Slider
   */
  defaultValue: PropTypes.number,
  /**
   * Callback function when slider value changes
   */
  onChange: PropTypes.func,
};

Slider.defaultProps = {
  ctrCls: "",
  type: SliderTypes.CONTINUOUS,
  start: 1,
  end: 100,
  size: Size.SMALL,
};

export default Slider;
