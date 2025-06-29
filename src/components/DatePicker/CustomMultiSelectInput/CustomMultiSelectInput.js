import { forwardRef, useRef, useEffect, useMemo } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import styles from "./CustomMultiSelectInput.module.scss";
import { Chip } from "../../Chips";
import { SearchCloseIcon, DatePickerCalendarIcon } from "../../../Icons";
const CustomMultiSelectInput = forwardRef(function (props, ref) {
  const { onSelect, setMultiSelectedDates } = props;
  const multiSelectedDates = useRef();

  useEffect(() => {
    multiSelectedDates.current = props.multiSelectedDates
      .map((date) => moment(new Date(date)).format("DD MMM,YYYY "))
      .toString();
  }, [props.multiSelectedDates]);

  const blinker = useMemo(() => {
    if (!props.calendarVisible) return null;
    return <div className={styles.blinker}></div>;
  }, [props.calendarVisible]);

  const renderFirstSelectedItem = useMemo(() => {
    if (props.multiSelectedDates.length > 0) {
      const first = moment(props.multiSelectedDates[0]).format("DD MMM,YYYY");
      const onClearFirstClick = () => {
        const multiSelected = [...props.multiSelectedDates];
        multiSelected.splice(0, 1);
        onSelect(multiSelected);
        setMultiSelectedDates(multiSelected);
      };

      return (
        <Chip
          onClick={onClearFirstClick}
          label={first}
          uniqueId={1667562492505}
          onClose={onClearFirstClick}
          canShowClose={true}
        />
      );
    } else {
      return props.placeholder;
    }
  }, [
    onSelect,
    props.multiSelectedDates,
    props.placeholder,
    setMultiSelectedDates,
  ]);

  const ellipsis = useMemo(() => {
    if (props.multiSelectedDates.length > 1) {
      return (
        <div
          className={styles.ellipsisContainer}
          title={multiSelectedDates.current}
        >
          <div className={styles.ellipse}></div>
          <div className={styles.ellipse}></div>
          <div className={styles.ellipse}></div>
        </div>
      );
    } else {
      return null;
    }
  }, [props.multiSelectedDates]);

  const selectedCounter = useMemo(() => {
    if (props.multiSelectedDates.length > 1) {
      return (
        <div
          className={styles.selectedCounter}
          title={multiSelectedDates.current}
        >
          {props.multiSelectedDates.length}
        </div>
      );
    } else {
      return null;
    }
  }, [props.multiSelectedDates]);

  const clearAll = useMemo(() => {
    if (props.multiSelectedDates.length > 1) {
      const onClearClick = (event) => {
        event.stopPropagation();
        onSelect([]);
        setMultiSelectedDates([]);
      };
      return (
        <SearchCloseIcon
          className={styles.clearAll}
          onClick={onClearClick}
          uniqueId={1667891626930}
        />
      );
    } else {
      return null;
    }
  }, [onSelect, props.multiSelectedDates, setMultiSelectedDates]);

  return (
    <div
      className={`
        ${styles.customMultiSelectInput}
        ${props.calendarVisible ? styles.calendarVisible : ""}
      `}
      onClick={props.onInputClick}
      data-dz-unique-id={`${props.automationIdPrefix}-1669211797773-input-date-picker`}
    >
      <div className={styles.inputGroup}>
        {blinker}
        <span
          className={`${styles.firstMultiSelected} ${
            props.multiSelectedDates.length === 0 ? styles.placeholderMode : ""
          }`}
          title={multiSelectedDates.current}
        >
          {renderFirstSelectedItem}
        </span>
        {ellipsis}
        {selectedCounter}
        {clearAll}
        <input
          ref={ref}
          type="text"
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          readOnly
        />
        <div className={styles.iconContainer} data-name="calendar-icon">
          <DatePickerCalendarIcon />
        </div>
      </div>
    </div>
  );
});

CustomMultiSelectInput.propTypes = {
  calendarVisible: PropTypes.bool,
  multiSelectedDates: PropTypes.array,
  name: PropTypes.string,
  onInputClick: PropTypes.func,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  setMultiSelectedDates: PropTypes.func,
  value: PropTypes.string,
  automationIdPrefix: PropTypes.string,
};

CustomMultiSelectInput.displayName = "CustomMultiSelectInput";
export default CustomMultiSelectInput;
