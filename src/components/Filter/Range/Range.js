import PropTypes from "prop-types";
import { Popper } from "../../Popper";
import styles from "./Range.module.scss";
import { Footer } from "../Footer";
import { TextField } from "../../TextField";
import { TextFieldTypes } from "../../../Enums";
import { useState } from "react";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
function Range({
  referenceElement,
  isOpen,
  onApply,
  onCancel,
  popperModifiers,
  min,
  max,
  selectedMin,
  selectedMax,
  isNonDiscreteApplyButton,
  showErrorOnLimitReachedForAFilter,
  canRestrictItemChanges,
  isMandatory,
}) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const [minMax, setMinMax] = useState([selectedMin, selectedMax]);
  const [minErrorMessage, setMinErrorMessage] = useState(null);
  const [maxErrorMessage, setMaxErrorMessage] = useState(null);
  const [clearAllResetKey, setClearAllResetKey] = useState(Date.now());

  const _onCancel = () => {
    if (isNonDiscreteApplyButton) {
      if (canApply()) {
        _onApply();
      } else {
        setMinMax([selectedMin, selectedMax]);
        setMinErrorMessage(null);
        setMaxErrorMessage(null);
        onCancel();
      }
    } else {
      setMinMax([selectedMin, selectedMax]);
      setMinErrorMessage(null);
      setMaxErrorMessage(null);
      onCancel();
    }
  };

  const _onClearAll = () => {
    setMinMax([]);
    setMinErrorMessage(null);
    setMaxErrorMessage(null);
    setClearAllResetKey(Date.now());
  };

  const isAnyValueApplied = minMax.some((item) => {
    return item !== undefined;
  });

  const isMandatoryAndSelected = () =>
    isMandatory ? minMax.length === 2 : true;

  const canApply = () => {
    const isMinValueLessThanMaxValue = minMax[0] < minMax[1];
    const isMinNotSameAsPrevMin = minMax[0] !== selectedMin;
    const isMaxNotSameAsPrevMax = minMax[1] !== selectedMax;
    const isMinMaxAvailable =
      typeof minMax[0] === "number" && typeof minMax[1] === "number";
    const isMinMaxNotAvailable = minMax.every((item) => {
      return typeof item === "undefined" || item === "";
    });

    if (isMinMaxAvailable) {
      return (
        !minErrorMessage &&
        !maxErrorMessage &&
        isMinValueLessThanMaxValue &&
        (isMinNotSameAsPrevMin || isMaxNotSameAsPrevMax)
      );
    }

    return (
      isMinMaxNotAvailable &&
      (isMinNotSameAsPrevMin || isMaxNotSameAsPrevMax) &&
      isMandatoryAndSelected()
    );
  };

  const onUpdateMinErrorMessage = (e) => {
    const value = e.target.valueAsNumber;
    const isValueLessThanDefinedMin = value < min;
    const isValueGreaterThanDefinedMax = value > max;
    const isValueGreaterThanMax = value > minMax[1];

    if (isValueLessThanDefinedMin) {
      setMinErrorMessage(`${t("filter.range.mintext")} ${min}`);
    } else if (isValueGreaterThanDefinedMax) {
      setMinErrorMessage(`${t("filter.range.maxtext")} ${max}`);
    } else if (isValueGreaterThanMax) {
      // TODO: This message is not displayed due how TextField handles state
      /* istanbul ignore next */
      setMinErrorMessage(`${t("filter.range.currentmax")} ${minMax[1]}`);
    } else if (isNaN(value)) {
      setMinErrorMessage(`${t("filter.range.invalidnumber")}`);
    }

    if (e.target.value === "") {
      setMinMax([undefined, minMax[1]]);
    } else {
      setMinMax([value, minMax[1]]);
    }
  };

  const onUpdateMaxErrorMessage = (e) => {
    const value = e.target.valueAsNumber;
    const isValueLessThanDefinedMin = value < min;
    const isValueGreaterThanDefinedMax = value > max;
    const isValueLessThanMin = value < minMax[0];

    if (e.target.value === "") {
      setMinMax([minMax[0], undefined]);
    } else {
      setMinMax([minMax[0], value]);
    }

    if (isValueLessThanDefinedMin) {
      setMaxErrorMessage(`${t("filter.range.mintext")} ${min}`);
    } else if (isValueGreaterThanDefinedMax) {
      setMaxErrorMessage(`${t("filter.range.maxtext")} ${max}`);
    } else if (isValueLessThanMin) {
      // TODO: This message is not displayed due how TextField handles state
      /* istanbul ignore next */
      setMaxErrorMessage(`${t("filter.range.currentmin")} ${minMax[0]}`);
    } else if (isNaN(value)) {
      setMaxErrorMessage(`${t("filter.range.invalidnumber")}`);
    }
  };

  const _onApply = () => {
    onApply(minMax);
    setMinErrorMessage(null);
    setMaxErrorMessage(null);
  };

  const onChangeMin = (e) => {
    if (canRestrictItemChanges) {
      return showErrorOnLimitReachedForAFilter();
    }
    setMinMax([e.target.valueAsNumber, minMax[1]]);
    setMinErrorMessage(null);
  };

  const onChangeMax = (e) => {
    if (canRestrictItemChanges) {
      return showErrorOnLimitReachedForAFilter();
    }
    setMinMax([minMax[0], e.target.valueAsNumber]);
    setMaxErrorMessage(null);
  };

  return (
    <Popper
      isVisible={isOpen}
      referenceElement={referenceElement}
      onClickOutside={_onCancel}
      modifiers={popperModifiers}
      isPortal
      placement="bottom-end"
    >
      <div className={styles.container}>
        <span className={styles.title}>Select Range</span>
        <div className={styles.innerContainer}>
          <div className={styles.inputsContainer} key={clearAllResetKey}>
            <TextField
              uniqueId={1671011377446}
              label={""}
              value={minMax[0]}
              title={t("common.min")}
              ctrCls={styles.textFields}
              min={min}
              max={max}
              placeholder={min.toString()}
              type={TextFieldTypes.NUMBER}
              onChange={onChangeMin}
              errorMessage={minErrorMessage}
              onInvalidNumberInput={onUpdateMinErrorMessage}
            />
            <TextField
              uniqueId={1671011469385}
              value={minMax[1]}
              label={""}
              title={t("common.max")}
              ctrCls={styles.textFields}
              min={min}
              max={max}
              placeholder={max.toString()}
              type={TextFieldTypes.NUMBER}
              onChange={onChangeMax}
              errorMessage={maxErrorMessage}
              onInvalidNumberInput={onUpdateMaxErrorMessage}
            />
          </div>
        </div>
        {!isNonDiscreteApplyButton && (
          <Footer
            canShowClearAll={isAnyValueApplied}
            onApply={_onApply}
            onClearAll={_onClearAll}
            onCancel={_onCancel}
            canApply={canApply()}
          />
        )}
      </div>
    </Popper>
  );
}

Range.propTypes = {
  referenceElement: PropTypes.object,
  isOpen: PropTypes.bool,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  popperModifiers: PropTypes.array,
  min: PropTypes.number,
  max: PropTypes.number,
  selectedMin: PropTypes.number,
  selectedMax: PropTypes.number,
  isNonDiscreteApplyButton: PropTypes.bool,
  canRestrictItemChanges: PropTypes.bool,
  isMandatory: PropTypes.bool,
  showErrorOnLimitReachedForAFilter: PropTypes.func,
};

export default Range;
