import { useState, useRef, forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";
import DropDown from "../DropDown/DropDown";
import AppIcon from "../AppIcon/AppIcon";

const CustomInput = forwardRef(
  ({ value, onClick, disabled, placeholder }, ref) => {
    return (
      <div className="react-datepicker-input-block">
        <input
          className="react-datepicker-input"
          onClick={onClick}
          ref={ref}
          value={value}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          readOnly
        />
        <AppIcon
          ctrCls="datepicker-img"
          iconCls="icon-calendar"
          onClick={onClick}
        />
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  /**
   * date value for the input
   */
  value: PropTypes.string,
  /**
   * onClick is a function provides the datepicker value when clicked
   */
  onClick: PropTypes.func,
  /**
   * disables the input
   */
  disabled: PropTypes.bool,
  /**
   * Placeholder for the input
   */
  placeholder: PropTypes.string,
};

/**
 * @deprecated
 */
const DateTimePicker = ({
  ctrCls,
  label,
  dateFormat,
  onChange,
  selected,
  selectRange,
  startDate,
  endDate,
  minDate,
  maxDate,
  name,
  showYearDropdown,
  disabled,
  placeholder,
  heading
}) => {
  const yesterday = moment().subtract(1, "days");
  const toDate = yesterday.format();

  const dateRef = useRef();

  const [startDateLocal, setStartDateLocal] = useState(null);

  const [endDateLocal, setEndDateLocal] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(selectRange);

  useEffect(() => {
    setStartDateLocal(selectRange ? startDate : selected);
    setEndDateLocal(endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  useEffect(() => {
    if (!selectRange) {
      setEndDateLocal(null);
    }
  }, [selectRange]);

  useEffect(() => {
    if (selected) {
      setStartDateLocal(selected);
    }
  }, [selected]);

  const handleChange = (dates) => {
    if (Array.isArray(dates)) {
      dates.map((date, i) => {
        if (date) {
          if (i === 0) {
            date.setHours("00");
            date.setMinutes("00");
            date.setSeconds("00");
          } else if (i === 1) {
            date.setHours("23");
            date.setMinutes("59");
            date.setSeconds("59");
          }
        }
      });
    }
    onChange(dates, { value: 0 });
    setSelectedTimePeriod({ value: 0 });
    if (selectRange) {
      const [start, end] = dates;
      setStartDateLocal(start);
      setEndDateLocal(end);
    } else {
      setStartDateLocal(dates);
    }
  };

  const getFromDay = (number, metric) => {
    const fromDay = moment(moment().subtract(number, metric));
    return fromDay;
  };

  const getLastQuarter = () => {
    const lastQuarter = Math.floor(yesterday.month() / 3);
    let to, from;
    if (lastQuarter === 0) {
      from = moment(`10/01/${yesterday.year() - 1}`);
      to = moment(`12/31/${yesterday.year() - 1}`);
    } else if (lastQuarter === 1) {
      from = moment(`01/01/${yesterday.year()}`);
      to = moment(`03/31/${yesterday.year()}`);
    } else if (lastQuarter === 2) {
      from = moment(`04/01/${yesterday.year()}`);
      to = moment(`06/30/${yesterday.year()}`);
    } else if (lastQuarter === 3) {
      from = moment(`07/01/${yesterday.year()}`);
      to = moment(`09/30/${yesterday.year()}`);
    }
    return { from, to };
  };

  const getCurrentQuarter = () => {
    const currentQuarter = Math.ceil((yesterday.month() + 1) / 3);
    let from;
    if (currentQuarter === 1) {
      from = moment(`01/01/${yesterday.year()}`);
    } else if (currentQuarter === 2) {
      from = moment(`04/01/${yesterday.year()}`);
    } else if (currentQuarter === 3) {
      from = moment(`07/01/${yesterday.year()}`);
    } else if (currentQuarter === 4) {
      from = moment(`10/01/${yesterday.year()}`);
    }
    return from;
  };

  const timeOptions = [
    {
      value: 1,
      label: "Last 24 hours",
      availableUntil: moment(),
      availableFrom: getFromDay(24, "hours"),
      subLabel: null,
    },
    {
      value: 2,
      label: "Last 7 days",
      availableUntil: moment(toDate),
      availableFrom: getFromDay(7, "days"),
      subLabel:
        getFromDay(7, "days").format("DD MMM ") +
        " - " +
        yesterday.format("DD MMM"),
    },
    {
      value: 3,
      label: "Last 14 days",
      availableUntil: moment(toDate),
      availableFrom: getFromDay(14, "days"),
      subLabel:
        getFromDay(14, "days").format("DD MMM ") +
        " - " +
        moment(toDate).format("DD MMM"),
    },
    {
      value: 4,
      label: "Last 30 days",
      availableUntil: moment(toDate),
      availableFrom: getFromDay(30, "days"),
      subLabel:
        getFromDay(30, "days").format("DD MMM") +
        " - " +
        moment(toDate).format("DD MMM"), // getFromDay(30, "days").format('DD MMM')
    },
    {
      value: 5,
      label: "Current Month",
      availableUntil: moment(toDate),
      availableFrom: moment(`${yesterday.month() + 1}/01/${yesterday.year()}`),
      subLabel: yesterday.format("MMM YYYY"),
    },
    {
      value: 6,
      label: "Last Month",
      availableUntil: moment(
        `${yesterday.month() === 0 ? 12 : yesterday.month()}/31/${
          yesterday.month() === 0 ? yesterday.year() - 1 : yesterday.year()
        }`
      ),
      availableFrom: moment(
        `${yesterday.month() === 0 ? 12 : yesterday.month()}/01/${
          yesterday.month() === 0 ? yesterday.year() - 1 : yesterday.year()
        }`
      ),
      subLabel: moment(
        `${yesterday.month() === 0 ? 12 : yesterday.month()}/01/${
          yesterday.month() === 0 ? yesterday.year() - 1 : yesterday.year()
        }`
      ).format("MMM YYYY"),
    },
    {
      value: 7,
      label: "Current quarter",
      availableUntil: moment(toDate),
      availableFrom: getCurrentQuarter(),
      subLabel:
        getCurrentQuarter().format("MMM YYYY") +
        " - " +
        moment(toDate).format("MMM YYYY"),
    },
    {
      value: 8,
      label: "Last quarter",
      availableUntil: getLastQuarter().to,
      availableFrom: getLastQuarter().from,
      subLabel:
        getLastQuarter().from.format("MMM YYYY") +
        " - " +
        getLastQuarter().to.format("MMM YYYY"),
    },
  ];

  const handleSelectedTimePeriod = (value) => {
    dateRef.current.cancelFocusInput();
    // dateRef.current.setOpen(false);

    //setOpen
    const start = Date.parse(value.availableFrom);
    const end = Date.parse(value.availableUntil);
    setStartDateLocal(start);
    setEndDateLocal(end);
    setSelectedTimePeriod(value);
    onChange([start, end], value);
  };

  const getYear = (date) => {
    return moment(date).format("YYYY");
  };
  const getMonth = (date) => {
    return moment(date).format(showYearDropdown ? "MMMM" : "MMMM YYYY");
  };
  const getRandomYears = () => {
    const currentYear = new Date().getFullYear();
    const year = [];
    for (let i = currentYear + 1; i <= currentYear + 10; i++) {
      year.unshift(i.toString());
    }
    for (let i = currentYear - 1; i >= currentYear - 10; i--) {
      year.push(i.toString());
    }
    year.unshift(currentYear.toString());
    return year;
  };
  const years = getRandomYears();

  const renderCustomHeader = ({
    date,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--previous"
        aria-label="Previous Month"
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
          Previous Month
        </span>
      </button>
      <div className="react-datepicker__custom_header ">
        <div
          style={showYearDropdown ? {} : { padding: 10 }}
          className="react-datepicker__current-month react-datepicker__current-month--hasYearDropdown"
        >
          {getMonth(date)}
        </div>
        {showYearDropdown && (
          <DropDown
            ctrCls={"year-dropdown"}
            items={years.map((val) => ({ label: val, value: val }))}
            onSelect={({ value }) => {
              changeYear(value);
            }}
            value={{ label: getYear(date), value: getYear(date) }}
          />
        )}
      </div>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--next"
        aria-label="Next Month"
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
          Next Month
        </span>
      </button>
    </div>
  );

  const renderCustomHeaderTwo = ({
    monthDate,
    customHeaderCount,
    decreaseMonth,
    increaseMonth,
    changeYear,
    date,
  }) => (
    <div
      style={{
        margin: "2px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={decreaseMonth}
        style={customHeaderCount === 1 ? { visibility: "hidden" } : null}
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--previous"
        aria-label="Previous Month"
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
          Previous Month
        </span>
      </button>
      <span
        style={showYearDropdown ? {} : { padding: 5 }}
        className="react-datepicker__current-month"
      >
        {getMonth(monthDate)}
      </span>
      {showYearDropdown && (
        <DropDown
          ctrCls={"year-dropdown"}
          items={years.map((val) => ({ label: val, value: val }))}
          onSelect={({ value }) => {
            console.log(value);
            changeYear(value);
          }}
          value={{ label: getYear(date), value: getYear(date) }}
        />
      )}
      <button
        onClick={increaseMonth}
        style={customHeaderCount === 0 ? { visibility: "hidden" } : null}
        type="button"
        className="react-datepicker__navigation react-datepicker__navigation--next"
        aria-label="Next Month"
      >
        <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
          Next Month
        </span>
      </button>
    </div>
  );

  return (
    <div className={"Date-wrapper v2 " + ctrCls}>
      {!!label && <label>{label}</label>}

      <DatePicker
        ref={dateRef}
        name={name}
        renderCustomHeader={
          selectRange ? renderCustomHeaderTwo : renderCustomHeader
        }
        customInput={<CustomInput />}
        dateFormat={dateFormat}
        selected={startDateLocal}
        onChange={handleChange}
        formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
        dateFormatCalendar="LLLL yyyy"
        selectsRange={selectRange}
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        startDate={startDateLocal}
        endDate={endDateLocal}
        minDate={minDate || null}
        maxDate={maxDate || null}
        monthsShown={selectRange ? 2 : 1}
        focusSelectedMonth={true}
        disabled={disabled}
        placeholderText={placeholder}
      >
        <div className="custom-date-header">
          {selectRange ? heading ?? "Select Custom Date Range" : heading ?? "Select Date"}
        </div>
        {!!selectRange && (
          <div className="date-dropdown-block">
            <div className="popular-date-range">Popular Date Ranges</div>
            <div className="time-period">
              {timeOptions.map((timeOpt, index) => {
                return (
                  <div
                    key={`time_option_${index}`}
                    onClick={() => handleSelectedTimePeriod(timeOpt)}
                    className={
                      selectedTimePeriod?.value === timeOpt.value
                        ? "time-opt-container time-opt-selected"
                        : "time-opt-container"
                    }
                  >
                    {timeOpt.label}{" "}
                    {timeOpt.subLabel ? (
                      <div className="sub-title">
                        {"(" + timeOpt.subLabel + ")"}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DatePicker>
    </div>
  );
};

DateTimePicker.defaultProps = {
  ctrCls: "",
  name: "date",
  label: "",
  dateFormat: "dd/MM/yyyy",
  onChange: () => {},
  selected: null,
  selectRange: true,
  startDate: null,
  endDate: null,
  showYearDropdown: false,
};

DateTimePicker.propTypes = {
  /**
   * Specify ctrCls for the DatePicker class name
   */
  ctrCls: PropTypes.string,
  /**
   * define name for the input identity
   */
  name: PropTypes.string,
  /**
   * onChange is a function provides the datepicker value when change action performs
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Specify label for the DatePicker
   */
  label: PropTypes.string,
  /**
   * store date value while onchange field
   */
  selected: PropTypes.instanceOf(Date),
  /**
   * store start date value while onchange field
   */
  startDate: PropTypes.instanceOf(Date),
  /**
   * store end date value while onchange field
   */
  endDate: PropTypes.instanceOf(Date),
  /**
   * define start and end date for the field
   */
  selectRange: PropTypes.bool,
  /**
   * Specify date format for the field
   */
  dateFormat: PropTypes.string,
  /**
   * Specify bool to show Year Dropdown
   */
  showYearDropdown: PropTypes.bool,
  /**
   * Specify min date
   */
  minDate: PropTypes.any,
  /**
   * Specify max date
   */
  maxDate: PropTypes.any,
  /**
   * Disables the DatePicker
   */
  disabled: PropTypes.bool,
  /**
   * Specify placeholder text
   */
  placeholder: PropTypes.string,
  /**
   * Specify heading text
   */
  heading: PropTypes.string,
};

export default DateTimePicker;
