import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./DatePicker.module.scss";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
import PropTypes from "prop-types";
import { ButtonSize, DatePickerTypes, DefaultDateRanges } from "../../Enums";
import { CustomHeader } from "./CustomHeader";
import { CustomInput } from "./CustomInput";
import { CustomMultiSelectInput } from "./CustomMultiSelectInput";
import { CustomTimeInput } from "./CustomTimeInput";
import { Label } from "../Label";
import { PlainButton } from "../AppButton";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import {
  createQuarterDateRange,
  invariantAutomationPrefixId,
  invariantUniqueId,
  patchTimeToEndOfDay,
} from "../../Utils";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const DatePicker = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Date Picker");
    invariantUniqueId(props.uniqueId, "Date Picker");
  }, [automationIdPrefix, props.uniqueId]);

  const { onChange, onQuickActions } = props;
  const reactDatePickerRef = useRef();
  const containerRef = useRef();
  const timePickerAutoOpenRef = useRef(-1);

  const [calendarVisible, setCalendarVisible] = useState(props.isInline);
  const [selected, setSelected] = useState(() => {
    if (props.type === DatePickerTypes.STANDARD)
      return props.defaultDates[0] || "";
    return null;
  });
  const [multiSelectedDates, setMultiSelectedDates] = useState(() => {
    if (props.type === DatePickerTypes.MULTI_SELECT) return props.defaultDates;
    return [];
  });
  const [dateRange, setDateRange] = useState(() => {
    if (props.type === DatePickerTypes.RANGE) {
      return props.defaultDates.flat();
    }
    return [];
  });
  const [datePickerKey, setDatePickerKey] = useState(Date.now());
  const [isTimePickerActive, setIsTimePickerActive] = useState(false);
  const [yearDropDownVisible, setYearDropDownVisible] = useState([
    false,
    false,
  ]);

  const [isPopperReferenceHidden, setIsPopperReferenceHidden] = useState(false);

  const modifiers = useMemo(() => {
    return [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "hidePopper",
        phase: "afterWrite",
        enabled: true,
        fn: ({ state }) => {
          const isRefHidden =
            state.attributes.popper["data-popper-reference-hidden"];
          setIsPopperReferenceHidden(isRefHidden);
        },
      },
    ];
  }, []);

  useEffect(
    function resetPreviouslyExpanded() {
      if (!calendarVisible && timePickerAutoOpenRef.current !== -1) {
        clearTimeout(timePickerAutoOpenRef.current);
        timePickerAutoOpenRef.current = -1;
      }
    },
    [calendarVisible]
  );

  useEffect(() => {
    return () => {
      if (timePickerAutoOpenRef.current !== -1) {
        clearTimeout(timePickerAutoOpenRef);
      }
    };
  }, []);

  const multiSelect = useMemo(() => {
    return props.type === DatePickerTypes.MULTI_SELECT;
  }, [props.type]);

  const selectRange = useMemo(() => {
    return props.type === DatePickerTypes.RANGE;
  }, [props.type]);

  const clearDate = useCallback(() => {
    setSelected(null);
    setMultiSelectedDates([]);
    setDateRange([]);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      clear: clearDate,
    }),
    [clearDate]
  );

  const onChangeDate = (dates) => {
    switch (props.type) {
      case DatePickerTypes.STANDARD:
        setSelected(dates);
        if (!props.canShowTimeInput && !props.isInline) {
          setCalendarVisible(false);
        }
        props.onChange(dates);
        break;
      case DatePickerTypes.RANGE: {
        let [start, end] = dates;
        setDateRange([start, end]);
        if (start && end) {
          if (!props.isInline) {
            setCalendarVisible(false);
          }
        }
        const modifiedDates = structuredClone(dates);
        if (!props.canShowTimeInput) {
          modifiedDates[1] = patchTimeToEndOfDay(modifiedDates[1]);
        }
        props.onChange(modifiedDates);
        break;
      }
      case DatePickerTypes.MULTI_SELECT:
        props.onChange(dates);
    }

    setYearDropDownVisible([false, false]);

    if (props.canShowTimeInput && timePickerAutoOpenRef.current === -1) {
      timePickerAutoOpenRef.current = setTimeout(() => {
        if (reactDatePickerRef.current) setIsTimePickerActive(true);
      }, 350);
    } else if (props.canShowTimeInput && selected && dates) {
      // close the time picker only if the date is modified
      // changing the time should not close the time picker
      if (
        selected.getMonth() !== dates.getMonth() ||
        selected.getDate() !== dates.getDate() ||
        selected.getFullYear() !== dates.getFullYear()
      ) {
        setIsTimePickerActive(false);
      }
    }
  };

  const onSelectDate = (date) => {
    const multiSelected = [...multiSelectedDates];
    const selectedDateIndex = multiSelected.findIndex((selected) => {
      return (
        moment(selected).format("YYYY-MM-DD") ===
        moment(date).format("YYYY-MM-DD")
      );
    });

    if (selectedDateIndex === -1) {
      multiSelected.push(date);
    } else {
      multiSelected.splice(selectedDateIndex, 1);
    }
    props.onSelect(multiSelected);
    if (props.type === DatePickerTypes.MULTI_SELECT) {
      setMultiSelectedDates(multiSelected);
    }
  };

  const renderCustomHeader = useCallback(
    (headerProps) => {
      const {
        changeYear,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
        monthDate,
      } = headerProps;

      return (
        <CustomHeader
          changeYear={changeYear}
          customHeaderCount={customHeaderCount}
          decreaseMonth={decreaseMonth}
          increaseMonth={increaseMonth}
          monthDate={monthDate}
          selectRange={selectRange}
          canShowYearDropDown={props.canShowYearDropDown}
          isYearDropDownVisible={yearDropDownVisible[customHeaderCount]}
          setIsYearDropDownVisible={(visible) => {
            const updatedDropdownVisibility = [false, false];
            updatedDropdownVisibility[customHeaderCount] = visible;
            setYearDropDownVisible(updatedDropdownVisibility);
            setIsTimePickerActive(false);
          }}
          automationIdPrefix={automationIdPrefix}
          uniqueId={props.uniqueId}
          yearRange={props.yearRange}
        />
      );
    },
    [
      selectRange,
      props.canShowYearDropDown,
      props.uniqueId,
      props.yearRange,
      yearDropDownVisible,
      automationIdPrefix,
    ]
  );

  const getQuarterTillDateActions = useCallback((t) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentQuarter = Math.floor(now.getMonth() / 3) + 1; // Ensure range 1-4

    return Array.from({ length: 4 }, (_, i) => {
      let quarter = currentQuarter - i;
      let year = currentYear;

      if (quarter < 1) {
        quarter += 4;
        year -= 1;
      }

      const monthLabel = new Date(year, (quarter - 1) * 3, 1).toLocaleString(
        "default",
        {
          month: "short",
          year: "numeric",
        }
      );

      return {
        id: `Q${quarter}-${year}`,
        label: t("datePicker.quarterTilldate", { quarter: monthLabel }),
        onCustomRange: (callback) =>
          callback(createQuarterDateRange(quarter, year)),
      };
    });
  }, []);

  const renderQuickActionButtons = useMemo(() => {
    if (selectRange) {
      const createRange = (end) => [...Array(end).keys()];

      const defaultActions = [
        {
          id: DefaultDateRanges.THIS_WEEK,
          label: t("datePicker.thisWeek"),
          onCustomRange: (callback) => {
            const daysOfThisWeek = createRange(7).map((_, index) => {
              return new Date(moment().weekday(index).format("yyyy/MM/DD"));
            });
            callback([
              daysOfThisWeek[0],
              daysOfThisWeek[daysOfThisWeek.length - 1],
            ]);
          },
        },
        {
          id: DefaultDateRanges.LAST_15,
          label: t("datePicker.last15"),
          range: -15,
        },
        {
          id: DefaultDateRanges.LAST_30,
          label: t("datePicker.last30"),
          range: -30,
        },
        {
          id: DefaultDateRanges.LAST_3_MONTHS,
          label: t("datePicker.last3months"),
          range: -90,
        },
      ];

      let finalActions = props.includeQuarterTillDateActions
        ? [...defaultActions, ...getQuarterTillDateActions(t)]
        : [...defaultActions];
      onQuickActions(finalActions);

      const createRangeCallback = (quickActionRange) => {
        const resolveRange = () => {
          const numbersRange = createRange(
            Math.abs(quickActionRange.range)
          ).map((el) => el + 1);
          return quickActionRange.range > 0
            ? numbersRange
            : numbersRange.map((el) => el * -1);
        };
        return () => {
          const daysRange = resolveRange().map((increment) => {
            return new Date(
              moment(new Date()).add(increment, "days").format("yyyy/MM/DD")
            );
          });
          if (quickActionRange.range > 0) {
            onChange(
              [
                daysRange[0],
                patchTimeToEndOfDay(daysRange[daysRange.length - 1]),
              ],
              quickActionRange
            );
            setDateRange([daysRange[0], daysRange[daysRange.length - 1]]);
            setDatePickerKey(Date.now());
            setYearDropDownVisible([false, false]);
          } else {
            onChange(
              [
                daysRange[daysRange.length - 1],
                patchTimeToEndOfDay(daysRange[0]),
              ],
              quickActionRange
            );
            setDateRange([daysRange[daysRange.length - 1], daysRange[0]]);
            setDatePickerKey(Date.now());
            setYearDropDownVisible([false, false]);
          }
          reactDatePickerRef.current.setOpen(false);
        };
      };

      const callback = (range, quickAction) => {
        setDateRange(range);
        reactDatePickerRef.current.setOpen(false);
        if (quickAction.canIgnoreEndDateTimePatch)
          onChange([range[0], range[1]], quickAction);
        else onChange([range[0], patchTimeToEndOfDay(range[1])], quickAction);
        setDatePickerKey(Date.now());
        setYearDropDownVisible([false, false]);
      };

      const quickActionRangeButtons = finalActions.map((el) => {
        return (
          <PlainButton
            ctrCls={styles.quickActionButtons}
            key={el.id || el.label}
            size={ButtonSize.SMALL}
            onClick={
              el.onCustomRange
                ? el.onCustomRange.bind(this, function (range) {
                    callback(range, el);
                  })
                : createRangeCallback(el)
            }
            label={el.label}
            uniqueId={`${1666074600270}-${el.id}`}
          />
        );
      });

      return <>{quickActionRangeButtons}</>;
    } else {
      const onClickToday = () => {
        onChange(new Date());
        setSelected(new Date());
        reactDatePickerRef.current.setOpen(false);
        setDatePickerKey(Date.now());
        setYearDropDownVisible([false, false]);
      };
      const minDate = props.minDate
        ? moment(props.minDate).startOf("day")
        : null;
      const maxDate = props.maxDate ? moment(props.maxDate).endOf("day") : null;

      const hideTodayBtn =
        (minDate && moment().isBefore(minDate)) ||
        (maxDate && moment().isAfter(maxDate));

      return multiSelect || props.canShowTimeInput || hideTodayBtn ? null : (
        <PlainButton
          onClick={onClickToday}
          ctrCls={styles.todayActionButton}
          label={t("datePicker.today")}
          uniqueId={1666074787676}
        />
      );
    }
  }, [
    onChange,
    multiSelect,
    onQuickActions,
    selectRange,
    props.canShowTimeInput,
    props.minDate,
    props.maxDate,
    t,
    props.includeQuarterTillDateActions,
    getQuarterTillDateActions,
  ]);

  return (
    <div
      className={`
        ${styles.datePicker}
        ${props.ctrCls}
        ${multiSelect ? styles.multiSelect : ""}
        ${selectRange ? styles.selectRange : ""}
      `}
      role="main"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-date-picker`}
      ref={containerRef}
    >
      {props.label ? (
        <Label
          text={props.label}
          ctrCls={props.labelCtrCls}
          isRequired={props.isRequired}
          uniqueId={1667226275891}
        />
      ) : null}
      <ReactDatePicker
        key={datePickerKey}
        ref={reactDatePickerRef}
        calendarClassName={`
          ${styles.calendar}
          ${calendarVisible ? styles.calendarVisible : ""}
          ${props.datePickerCtrCls}
        `}
        inline={props.isInline}
        customInput={
          multiSelect ? (
            <CustomMultiSelectInput
              calendarVisible={calendarVisible}
              name={props.name}
              multiSelectedDates={multiSelectedDates}
              onInputClick={() => {
                if (!props.isDisabled) {
                  setCalendarVisible(!calendarVisible);
                  setIsTimePickerActive(false);
                }
              }}
              onSelect={props.onSelect}
              placeholder={props.placeholder}
              setMultiSelectedDates={setMultiSelectedDates}
              automationIdPrefix={automationIdPrefix}
              uniqueId={props.uniqueId}
            />
          ) : (
            <CustomInput
              isDisabled={props.isDisabled}
              inputName={props.name}
              calendarVisible={calendarVisible}
              onInputClick={() => {
                if (!props.isDisabled) {
                  setCalendarVisible(!calendarVisible);
                  setIsTimePickerActive(false);
                  setYearDropDownVisible([false, false]);
                }
              }}
              placeholder={props.placeholder}
              automationIdPrefix={automationIdPrefix}
              uniqueId={props.uniqueId}
            />
          )
        }
        customTimeInput={
          <CustomTimeInput
            isActive={isTimePickerActive}
            setIsTimePickerActive={(active) => {
              setIsTimePickerActive(active);
              setYearDropDownVisible([false, false]);
            }}
            uniqueId={props.uniqueId}
            automationIdPrefix={automationIdPrefix}
          />
        }
        dateFormat={
          props.canShowTimeInput ? "dd/MM/yyyy,h:mm a" : props.dateFormat
        }
        disabled={props.isDisabled}
        endDate={dateRange[1]}
        formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 1)}
        highlightDates={multiSelectedDates}
        maxDate={props.maxDate}
        minDate={props.minDate}
        monthsShown={selectRange ? 2 : 1}
        multiSelect={multiSelect}
        onChange={onChangeDate}
        onSelect={onSelectDate}
        open={calendarVisible && !props.isDisabled}
        placeholderText={props.placeholder}
        renderCustomHeader={renderCustomHeader}
        selected={selected}
        selectsRange={selectRange}
        shouldCloseOnSelect={!multiSelect}
        showPopperArrow={false}
        showTimeInput={
          props.type === DatePickerTypes.RANGE ? false : props.canShowTimeInput // Disabling time input temporarily on range date picker
        }
        startDate={dateRange[0]}
        startOpen={false}
        timeFormat="hh:mm aa"
        popperPlacement="bottom-end"
        portalId="disprz-popper"
        popperModifiers={modifiers}
        popperClassName={`${styles.datePickerPopper} ${props.popperCtrCls} ${
          selectRange ? styles.selectRangePopper : ""
        } ${multiSelect ? styles.multiSelectPopper : ""} ${
          isPopperReferenceHidden ? styles.popperReferenceHidden : ""
        }`}
        onClickOutside={(e) => {
          if (!props.isInline) {
            if (
              e.composedPath().length > 0 &&
              !e.composedPath().includes(containerRef.current)
            ) {
              setCalendarVisible(false);
              setYearDropDownVisible([false, false]);
            }
          }
        }}
      >
        <section aria-label="quick-actions">
          <div className={styles.quickActions}>{renderQuickActionButtons}</div>
        </section>
      </ReactDatePicker>
    </div>
  );
});

DatePicker.displayName = "DatePicker";

DatePicker.propTypes = {
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * Default dates to be selected for all types of DatePicker
   *
   * Example:
   *
   * | Type | Value |
   * | --- | --- |
   * | `Standard` | [Date] |
   * | `MULTI_SELECT` | [Date, Date] |
   * | `RANGE` | [[StartDate, EndDate]] |
   *
   * **Note: For RANGE, always add one day extra to the endDate**
   */
  defaultDates: PropTypes.array,
  /**
   * Sets the name attribute of the Date Picker
   */
  name: PropTypes.string,
  /**
   * Callback function to be called when the date is changed
   */
  onChange: PropTypes.func,
  /**
   * Label for the Date Picker
   */
  label: PropTypes.string,
  /**
   * ctrCls for the Label component
   */
  labelCtrCls: PropTypes.string,
  /**
   * Adds a asterisk to the label
   */
  isRequired: PropTypes.bool,
  /**
   * Date format to be used for the Date Picker
   */
  dateFormat: PropTypes.string,
  /**
   * Determines whether the Date Picker can show year dropdown or not
   */
  canShowYearDropDown: PropTypes.bool,
  /**
   * Minimum date that can be selected
   */
  minDate: PropTypes.any,
  /**
   * Maximum date that can be selected
   */
  maxDate: PropTypes.any,
  /**
   * Determines whether the Date Picker is disabled or not
   */
  isDisabled: PropTypes.bool,
  /**
   * Placeholder text to be shown when no date is selected
   */
  placeholder: PropTypes.string,
  /**
   * Determine whether the Date Picker can show time input or not
   */
  canShowTimeInput: PropTypes.bool,
  /**
   * Allows to customize the quick actions, you can either pass a range or a onCustomRange function to customize the dates.
   *
   * Example:
   *
   * ```js
   * onQuickActions={(defaultActions) => {
   *  defaultActions.push({
   *    id: "next-2",
   *    label: "Next 2 days",
   *    range: -2,
   *    canIgnoreEndDateTimePatch: false, // Ignore manual end date patching
   *    onCustomRange: (callback) => {
   *      const daysRange = [
   *        new Date(moment(new Date()).add(1, "days").format("yyyy/MM/DD")),
   *        new Date(moment(new Date()).add(2, "days").format("yyyy/MM/DD")),
   *      ];
   *      callback([daysRange[0], daysRange[1]]);
   *    },
   *  });
   * }
   * ```
   *
   *
   */
  onQuickActions: PropTypes.func,
  /**
   * Callback function when a date is selected either the selected date or a new one
   */
  onSelect: PropTypes.func,

  /**
   * Determines whether the Date Picker can show Quarter till date quick actions
   */
  includeQuarterTillDateActions: PropTypes.bool,
  /**
   * Determines the type of Date Picker
   */
  type: PropTypes.oneOf([
    DatePickerTypes.STANDARD,
    DatePickerTypes.MULTI_SELECT,
    DatePickerTypes.RANGE,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Determines whether the Date Picker is rendered inline
   * (Date picker won't be closed automatically when a date is selected/changed)
   */
  isInline: PropTypes.bool,
  /**
   * Determines the date picker container class
   */
  datePickerCtrCls: PropTypes.string,
  /**
   * Determines the popper container class
   */
  popperCtrCls: PropTypes.string,
  /**
   * Start and End year for the year dropdown
   */
  yearRange: PropTypes.arrayOf(PropTypes.number),
};

DatePicker.defaultProps = {
  canShowTimeInput: false,
  canShowYearDropDown: true,
  ctrCls: "",
  dateFormat: "dd/MM/yyyy",
  defaultDates: [],
  labelCtrCls: "",
  onQuickActions: () => undefined,
  includeQuarterTillDateActions: false,
  onSelect: () => undefined,
  placeholder: "DD/MM/YYYY",
  onChange: () => undefined,
  type: DatePickerTypes.STANDARD,
  isInline: false,
  datePickerCtrCls: "",
  popperCtrCls: "",
  yearRange: [2000, new Date().getFullYear()],
};

export default DatePicker;
