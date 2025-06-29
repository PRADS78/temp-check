import { useState, useEffect, useRef } from "react";
import styles from "./Counter.module.scss";
import PropTypes from "prop-types";
import { Plus, Minus } from "@disprz/icons";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const CounterUpdateTypeRef = {
  DECREASE: 0,
  INCREASE: 1,
  MANUAL: -1,
};

function Counter(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Counter");
    invariantUniqueId(props.uniqueId, "Counter");
  }, [automationIdPrefix, props.uniqueId]);

  const [value, setValue] = useState(props.value);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef(null);
  const counterClickTypeRef = useRef(CounterUpdateTypeRef.MANUAL);
  const { onDecrease, onIncrease } = props;

  useEffect(() => {
    const ref = inputRef.current;
    if (ref && !props.shouldEnableValueChangeByInput) {
      const onFocus = () => {
        ref.select();
      };
      ref.addEventListener("focus", onFocus);
      return () => {
        ref.removeEventListener("focus", onFocus);
      };
    }
  }, [props.shouldEnableValueChangeByInput]);

  useEffect(() => {
    switch (counterClickTypeRef.current) {
      case CounterUpdateTypeRef.MANUAL:
        break;
      case CounterUpdateTypeRef.DECREASE:
        onDecrease(Number(value));
        counterClickTypeRef.current = CounterUpdateTypeRef.MANUAL;
        break;
      case CounterUpdateTypeRef.INCREASE:
        onIncrease(Number(value));
        counterClickTypeRef.current = CounterUpdateTypeRef.MANUAL;
        break;
    }
  }, [onDecrease, onIncrease, value]);

  const onChange = (event) => {
    let inputValue = event.target.value;
    counterClickTypeRef.current = CounterUpdateTypeRef.MANUAL;

    if (!props.shouldEnableValueChangeByInput) {
      return;
    }

    setValue(inputValue);
    if (
      Number(inputValue) >= props.min &&
      Number(inputValue) <= props.max &&
      inputValue !== ""
    ) {
      props.onChange(event, inputValue);
      setIsError(false);
    } else {
      setIsError(true);
      props.onInvalidInput(event, inputValue, {
        min: props.min,
        max: props.max,
      });
    }
  };

  const onValidateIncreaseAndReturnValue = (prev) => {
    setIsError(false);
    if (prev < props.min) {
      return Math.max(Number(prev) + parseInt(props.step, 10), props.min);
    } else if (Number(prev) + parseInt(props.step, 10) > props.max) {
      return props.max;
    } else {
      return Number(prev) + parseInt(props.step, 10);
    }
  };

  const onValidateDecreaseAndReturnValue = (prev) => {
    setIsError(false);
    if (Number(prev) - parseInt(props.step, 10) < props.min) {
      return props.min;
    } else if (prev > props.max) {
      return Math.min(Number(prev) + parseInt(props.step, 10), props.max);
    } else {
      return Number(prev) - parseInt(props.step, 10);
    }
  };

  return (
    <div
      className={styles.counter}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-counter`}
    >
      <Minus
        className={styles.decrease}
        onClick={() => {
          counterClickTypeRef.current = CounterUpdateTypeRef.DECREASE;
          setValue(onValidateDecreaseAndReturnValue);
        }}
        data-name="decrease-button"
        isDisabled={props.isDisabled || value <= props.min}
        uniqueId={1666943333461}
      />
      <div
        className={`${styles.inputContainer} ${isError ? styles.error : ""}`}
      >
        <input
          ref={inputRef}
          disabled={props.isDisabled}
          type="number"
          value={value}
          onChange={onChange}
          min={props.min}
          max={props.max}
          step={props.step}
        />
      </div>
      <Plus
        className={styles.increase}
        onClick={() => {
          counterClickTypeRef.current = CounterUpdateTypeRef.INCREASE;
          setValue(onValidateIncreaseAndReturnValue);
        }}
        data-name="increase-button"
        isDisabled={props.isDisabled || value >= props.max}
        uniqueId={1666943342323}
      />
    </div>
  );
}

Counter.propTypes = {
  /**
   * Can change counter value via input
   */
  shouldEnableValueChangeByInput: PropTypes.bool,
  /**
   * Disables the counter plus and minus click
   */
  isDisabled: PropTypes.bool,
  /**
   * Max cap for the Counter
   */
  max: PropTypes.number,
  /**
   * Min cap for the Counter
   */
  min: PropTypes.number,
  /**
   * OnChange for the counter when typed via input
   */
  onChange: PropTypes.func,
  /**
   * Handler when pressed via Minus button
   */
  onDecrease: PropTypes.func,
  /**
   * Handler when pressed via Plus button
   */
  onIncrease: PropTypes.func,
  /**
   * Value of the counter
   */
  value: PropTypes.any,
  /**
   * Step for the counter using keyboard (example: "0.2" will be incremented by 0.2 each time you press up/down)
   */
  step: PropTypes.string,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Handler when limit is exceeded
   */
  onInvalidInput: PropTypes.func,
};

Counter.defaultProps = {
  shouldEnableValueChangeByInput: true,
  max: 99,
  min: 0,
  step: "1",
  onInvalidInput: () => undefined,
};

export default Counter;
