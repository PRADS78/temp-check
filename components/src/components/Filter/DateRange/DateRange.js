import PropTypes from "prop-types";
import { useRef, useState } from "react";
import pickerStyles from "./DateRange.module.scss";
import { DatePicker } from "../../DatePicker";
import { DatePickerTypes } from "../../../Enums";
import Footer from "../Footer/Footer";
import { Popper } from "../../Popper";

function DateRange({
  referenceElement,
  isOpen,
  onApply,
  onCancel,
  selectedRange,
  popperModifiers,
  min,
  max,
  isNonDiscreteApplyButton,
  showErrorOnLimitReachedForAFilter,
  canRestrictItemChanges,
  onQuickActions,
  isMandatory,
}) {
  const datePickerRef = useRef(null);

  const [range, setRange] = useState(selectedRange);

  const isValidRangeSelected =
    range.length > 0 && range.every((date) => date instanceof Date);

  const canApply = isMandatory
    ? isValidRangeSelected
    : isValidRangeSelected || range.length === 0;

  const _onClearAll = () => {
    setRange([]);
    datePickerRef.current.clear();
  };

  const onRemoveActions = (actions) => {
    if (typeof onQuickActions === "function") return onQuickActions(actions);
    actions.splice(0, actions.length);
  };

  const onChange = (_range) => {
    if (canRestrictItemChanges) {
      _onClearAll();
      return showErrorOnLimitReachedForAFilter();
    }
    setRange(_range);
  };

  const _onCancel = () => {
    if (isNonDiscreteApplyButton) {
      if (canApply) {
        _onApply();
      }
    } else {
      setRange(selectedRange);
      onCancel(range);
    }
  };

  const _onApply = () => {
    onApply(range);
  };

  return (
    <Popper
      referenceElement={referenceElement}
      innerCtrCls={pickerStyles.container}
      isVisible={isOpen}
      modifiers={popperModifiers}
      isPortal
      onClickOutside={_onCancel}
      placement="bottom-end"
    >
      <DatePicker
        type={DatePickerTypes.RANGE}
        onChange={onChange}
        uniqueId={1670571134720}
        isInline={true}
        onQuickActions={onRemoveActions}
        datePickerCtrCls={"datePicker"}
        ref={datePickerRef}
        defaultDates={selectedRange}
        minDate={min}
        maxDate={max}
      />
      {!isNonDiscreteApplyButton && (
        <Footer
          canShowClearAll={range.length > 0}
          onApply={_onApply}
          onClearAll={() => {
            _onClearAll();
          }}
          onCancel={_onCancel}
          canApply={canApply}
        />
      )}
    </Popper>
  );
}

DateRange.propTypes = {
  selectedRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  referenceElement: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  popperModifiers: PropTypes.array,
  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),
  isNonDiscreteApplyButton: PropTypes.bool,
  canRestrictItemChanges: PropTypes.bool,
  showErrorOnLimitReachedForAFilter: PropTypes.func,
  onQuickActions: PropTypes.func,
  isMandatory: PropTypes.bool,
};

DateRange.defaultProps = {
  selectedRange: [],
  popperModifiers: [],
};

export default DateRange;
