import { useCallback, useRef } from "react";
import styles from "./CustomHeader.module.scss";
import PropTypes from "prop-types";
import { DownArrowIcon, LeftArrowIcon, RightArrowIcon } from "../../../Icons";
import moment from "moment";
import { Accordion, WobbleRotate } from "../../../Animation";

function CustomHeader({
  changeYear,
  customHeaderCount,
  decreaseMonth,
  increaseMonth,
  monthDate,
  selectRange,
  canShowYearDropDown,
  isYearDropDownVisible,
  setIsYearDropDownVisible,
  automationIdPrefix,
  yearRange,
}) {
  const yearDropDownRef = useRef();

  const getYearOptions = () => {
    const year = [];

    for (let i = yearRange[0]; i <= yearRange[1]; i++) {
      year.push(i.toString());
    }

    return year;
  };

  const getMonth = (date) => {
    return moment(date).format("MMMM");
  };

  const getYear = (date) => {
    return moment(date).format("YYYY");
  };

  const onDecreaseMonth = () => {
    decreaseMonth();
    setIsYearDropDownVisible(false);
  };

  const onIncreaseMonth = () => {
    increaseMonth();
    setIsYearDropDownVisible(false);
  };

  const onYearClick = (event) => {
    changeYear(event.target.innerHTML);
    setIsYearDropDownVisible(false);
  };

  const onYearDropDownClick = (event) => {
    event.stopPropagation();
    setIsYearDropDownVisible(!isYearDropDownVisible);
  };

  const getPageDirection = useCallback(() => {
    return document.getElementsByTagName("html")[0].dir;
  }, []);

  const renderYearDropDown = () => {
    if (canShowYearDropDown) {
      return (
        <>
          <WobbleRotate in={isYearDropDownVisible}>
            <DownArrowIcon
              className={styles.navigationButton}
              onClick={onYearDropDownClick}
              uniqueId={1666943365647}
            />
          </WobbleRotate>
          <Accordion
            contentRef={yearDropDownRef}
            expanded={isYearDropDownVisible}
            customClass={styles.yearDropDownAccordion}
            canDisableDynamicHeight={true}
          >
            <div
              ref={yearDropDownRef}
              className={styles.dropDown}
              role="listbox"
            >
              <ul className={styles.content}>
                {getYearOptions().map((year, index) => (
                  <li key={`year-option-${index}`} onClick={onYearClick}>
                    {year}
                  </li>
                ))}
              </ul>
            </div>
          </Accordion>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div
      className={`${styles.customHeader}`}
      data-dz-unique-id={`${automationIdPrefix}-1669211732043-custom-header-date-picker`}
    >
      {selectRange &&
      customHeaderCount === 1 &&
      getPageDirection() === "ltr" ? (
        <div></div>
      ) : (
        <LeftArrowIcon
          onClick={onDecreaseMonth}
          className={styles.disprzArrowIcons}
          uniqueId={1666943382150}
        />
      )}

      <section className={styles.monthYear}>
        <div className={styles.month}>{getMonth(monthDate)}</div>
        <div>{getYear(monthDate)}</div>
        {renderYearDropDown()}
      </section>
      {selectRange &&
      customHeaderCount === 0 &&
      getPageDirection() === "ltr" ? (
        <div></div>
      ) : (
        <RightArrowIcon
          onClick={onIncreaseMonth}
          className={styles.disprzArrowIcons}
          uniqueId={1666943400073}
        />
      )}
    </div>
  );
}

CustomHeader.propTypes = {
  changeYear: PropTypes.func,
  customHeaderCount: PropTypes.number,
  decreaseMonth: PropTypes.func,
  increaseMonth: PropTypes.func,
  monthDate: PropTypes.any,
  selectRange: PropTypes.bool,
  canShowYearDropDown: PropTypes.bool,
  isYearDropDownVisible: PropTypes.bool,
  setIsYearDropDownVisible: PropTypes.func,
  automationIdPrefix: PropTypes.string.isRequired,
  yearRange: PropTypes.arrayOf(PropTypes.number),
};

export default CustomHeader;
