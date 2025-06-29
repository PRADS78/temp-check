import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import * as Service from "../Service/Service";
import { UserDefinedField } from "../Models/UserDefinedField";
import DropDown from "../DropDown/DropDown";
import MultiSelectDropDown from "../MultiSelectDropDown/MultiSelectDropDown";
import "./UdfSelector.scss";
import AppIcon from "../AppIcon/AppIcon";
import DialogControl from "../DialogControl/DialogControl";

const comparer = (otherArray) => {
  return (current) => {
    return (
      otherArray.filter((other) => {
        return other?.value == current?.fieldId;
      }).length === 0
    );
  };
};

const formatToLabelValue = (arr, labelKey, valueKey) => {
  return (
    arr.reduce((a, c) => {
      const entry = {
        label: c[labelKey] || c,
        value: c[valueKey] || c,
      };
      a.push(entry);
      return a;
    }, []) || []
  );
};

/**
 * @deprecated
 */
const UdfSelector = ({
  udfCtrCls,
  udfValueCtrCls,
  selectedUdfValues,
  udfPlaceholder,
  udfValuePlaceholder,
  udfFetchAPiUrl,
  accessToken,
  onUdfValueSelect,
  disableSearch,
  deleteAlertContent,
  deleteOkButtonLabel,
  deleteCloseButtonLabel,
  udfValueStrings
}) => {
  const [userDefinedFields, setUserDefinedFields] = useState([]);
  const [udfSelectorNo, setUdfSelectorNo] = useState(0);
  const [udfOptions, setUdfOptions] = useState([]);
  const [udfValues, setUdfValues] = useState([]);
  const [udfValuesOptions, setUdfValuesOptions] = useState([]);
  const [selectedUdf, setSelectedUdf] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [index, setIndex] = useState(null);

  const fieldHasValue = useCallback(
    (index) => {
      if (selectedUdf[index].value === undefined) {
        return "has-no-value";
      } else {
        return "has-value";
      }
    },
    [selectedUdf]
  );

  const fieldItemHasValue = useCallback(
    (index) => {
      // initially returns null hence the immediate return
      if (!udfValues[index]) {
        return "has-no-value";
      }
      if (udfValues[index].length >= 1) {
        return "has-value";
      } else {
        return "has-no-value";
      }
    },
    [udfValues]
  );

  useEffect(() => {
    fetchUdfDetails();
  }, []);

  useEffect(() => {
    if (selectedUdfValues.length > 0) {
      const udfFields = [];
      udfFields.push(
        ...formatToLabelValue(selectedUdfValues, "udfFieldLabel", "udfFieldId")
      );
      const selectedValues = [];
      selectedUdfValues.forEach((udf) => {
        const values = [];
        udf.udfFieldValues.forEach(({ label, value }) => {
          const entry = {
            label: label,
            value: value,
          };
          values.push(entry);
        });
        selectedValues.push(values);
      });
      if (
        selectedUdf.length !== udfFields.length &&
        selectedUdf[selectedUdf.length - 1] &&
        Object.keys(selectedUdf[selectedUdf.length - 1]).length === 0
      ) {
        udfFields.push({});
      }
      setUdfValues([...selectedValues]);
      setSelectedUdf([...udfFields]);
    } else if (selectedUdf?.length === 0) {
      selectedUdf.push({});
      setSelectedUdf([...selectedUdf]);
    }
  }, [selectedUdfValues]);

  useEffect(() => {
    if (userDefinedFields.length > 0) {
      const udfOptions = formatToLabelValue(
        userDefinedFields,
        "fieldName",
        "fieldId"
      );
      setUdfOptions([...udfOptions]);
    }
    if (selectedUdf.length > 0) {
      const valuesOptions = [];
      selectedUdf.forEach((udfField) => {
        userDefinedFields.forEach((udf) => {
          if (udfField && udfField.value === udf.fieldId) {
            valuesOptions.push(udf.allowedValues);
          }
        });
      });
      const udfValuesOptions = [];
      valuesOptions.forEach((option) => {
        const entry = formatToLabelValue(option, "listItemValue", "listItemId");
        udfValuesOptions.push(entry);
      });
      setUdfValuesOptions([...udfValuesOptions]);
    }
  }, [userDefinedFields, selectedUdfValues, selectedUdf]);

  useEffect(() => {
    if (selectedUdf.length > 0) {
      let udfOptionsToDisplay = userDefinedFields.filter(comparer(selectedUdf));
      udfOptionsToDisplay = formatToLabelValue(
        udfOptionsToDisplay,
        "fieldName",
        "fieldId"
      );
      setUdfOptions([...udfOptionsToDisplay]);
    }
  }, [selectedUdf]);

  const fetchUdfDetails = async () => {
    setIsLoading(true);
    const data = await Service.getLimitedUserDefinedFieldsSummary(
      udfFetchAPiUrl,
      accessToken
    );
    setIsLoading(false);
    let userDefinedFields = data?.filter(function (userDefinedField) {
      if (
        userDefinedField.fieldType === "List" &&
        userDefinedField.allowedValues?.length > 0
      )
        return new UserDefinedField(userDefinedField);
    });
    setUserDefinedFields([...userDefinedFields]);
  };

  const onUdfSelect = (result, index) => {
    const entry = {
      label: result.label,
      value: result.value,
    };
    selectedUdf[udfSelectorNo] = entry;
    setSelectedUdf([...selectedUdf]);

    udfValues[index] = null;
    setUdfValues([...udfValues]);

    const valuesOptions = userDefinedFields.find(
      (udf, i) => udf.fieldId === result.value
    ).allowedValues;
    udfValuesOptions[index] = formatToLabelValue(
      valuesOptions,
      "listItemValue",
      "listItemId"
    );
    setUdfValuesOptions([...udfValuesOptions]);
  };

  const onValueSelect = (result, i) => {
    udfValues[i] = result;
    setUdfValues([...udfValues]);

    const entry = {
      udfFieldId: selectedUdf[i].value,
      udfFieldLabel: selectedUdf[i].label,
      udfFieldValues: result.map(({ label, value }) => {
        return { label, value };
      }),
    };
    selectedUdfValues[i] = entry;
    onUdfValueSelect([...selectedUdfValues]);
  };

  const onAddClick = () => {
    selectedUdf.push({});
    setSelectedUdf([...selectedUdf]);
  };

  const confirmationPopup = (index) => {
    setIsConfirmation(true);
    setIndex(index);
  };

  const onDeleteClick = (index) => {
    selectedUdf.splice(index, 1);
    setSelectedUdf([...selectedUdf]);

    udfValues.splice(index, 1);
    setUdfValues([...udfValues]);

    udfValuesOptions.splice(index, 1);
    setUdfValuesOptions([...udfValuesOptions]);

    selectedUdfValues.splice(index, 1);
    onUdfValueSelect([...selectedUdfValues]);
    setIsConfirmation(false);
  };

  const renderActionButtons = (index) => {
    const displayAddButton =
      selectedUdf[index] &&
      userDefinedFields.length - 1 !== index &&
      selectedUdf.length - 1 === index &&
      udfValues[index] &&
      udfValues[index].length > 0;
    const displayDeleteButton = selectedUdf.length - 1 > index || index > 0;
    return (
      <>
        {displayDeleteButton && (
          <div
            className={
              selectedUdf[index]?.value
                ? "action-fields"
                : "action-fields pos-button"
            }
            onClick={() => confirmationPopup(index)}
          >
            <AppIcon iconCls="trash-icon"></AppIcon>
          </div>
        )}

        {displayAddButton && (
          <>
            <div
              className={
                selectedUdf[index]?.value
                  ? "action-fields"
                  : "action-fields pos-button"
              }
              onClick={onAddClick}
            >
              <AppIcon iconCls="add-icon"></AppIcon>
              <span>Add</span>
            </div>
          </>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-field">
        <div className="animated-spinner-2" />
        <div className="summary-text text-center">{`Fetching`}</div>
      </div>
    );
  }

  return (
    <div className="udf-container">
      {selectedUdf?.length > 0 &&
        selectedUdf.map((udf, i) => (
          <div className="udf-selector-container">
            <div className="udf-selector" onClick={() => setUdfSelectorNo(i)}>
              <DropDown
                ctrCls={`${udfCtrCls} ${fieldHasValue(i)}`}
                placeholder={udfPlaceholder}
                items={udfOptions}
                value={selectedUdf[i]?.value ? selectedUdf[i] : undefined}
                onSelect={(value) => onUdfSelect(value, i)}
              />
            </div>
            {selectedUdf[i] &&
              udfValuesOptions[i] &&
              udfValuesOptions[i]?.length > 0 && (
                <div
                  className="udf-value-selector"
                  onClick={() => setUdfSelectorNo(i)}
                >
                  <MultiSelectDropDown
                    ctrCls={`${udfValueCtrCls} ${fieldItemHasValue(i)}`}
                    placeholder={udfValuePlaceholder}
                    items={udfValuesOptions[i]}
                    values={udfValues[i] ? udfValues[i] : undefined}
                    onSelect={(values) => onValueSelect(values, i)}
                    disableSearch={disableSearch}
                    overrideStrings={udfValueStrings}
                  />
                </div>
              )}
            {renderActionButtons(i)}
          </div>
        ))}

      {isConfirmation && (
        <DialogControl
          content={
            deleteAlertContent || "Do you really want to delete this item?"
          }
          showCloseButton={true}
          showOkButton={true}
          showHeaderCloseButton={false}
          okButtonLabel={deleteOkButtonLabel || "Delete"}
          closeButtonLabel={deleteCloseButtonLabel || "Cancel"}
          onCloseButtonClick={() => setIsConfirmation(false)}
          onOkButtonClick={() => onDeleteClick(index)}
        />
      )}
    </div>
  );
};

UdfSelector.propTypes = {
  /**
   * Specify ctrCls for the UDF field dropdown parent class name
   */
  udfCtrCls: PropTypes.string,
  /**
   * Specify ctrCls for the UDF value dropdown parent class name
   */
  udfValueCtrCls: PropTypes.string,
  /**
   * Specify the onSelect function is selection function for the UDF field dropdown
   */
  onUdfValueSelect: PropTypes.func.isRequired,
  /**
   * Specify the placeholder text for the UDF field dropdown
   */
  udfPlaceholder: PropTypes.string,
  /**
   * Specify the placeholder text for the UDF Value dropdown
   */
  udfValuePlaceholder: PropTypes.string,
  /**
   * Specify the host name url to fetch UDF data
   */
  udfFetchAPiUrl: PropTypes.string,
  /**
   * Specify the token required to call UDF service
   */
  accessToken: PropTypes.string,
  /**
   * Specify the initial value of UDF value
   */
  selectedUdfValues: PropTypes.array.isRequired,
  /**
   * Specify the disableSearch as true/false to display search search textbox on multi select drop down
   */
  disableSearch: PropTypes.bool,
  /**
   * Specify the text of deleteAlertContent
   */
  deleteAlertContent: PropTypes.string,
  /**
   * Specify the text of deleteOkButtonLabel
   */
  deleteOkButtonLabel: PropTypes.string,
  /**
   * Specify the text of deleteCloseButtonLabel
   */
  deleteCloseButtonLabel: PropTypes.string,
  /**
   * Specify the text of overrideStrings (Refer doc of MultiSelectDropDown)
   */
  udfValueStrings: PropTypes.object
};

UdfSelector.defaultProps = {
  selectedUdfValues: [],
  udfPlaceholder: "Select...",
  udfValuePlaceholder: "Select...",
  udfCtrCls: "udf-dropdown",
  udfValueCtrCls: "udf-value-dropdown",
  onUdfValueSelect: () => {},
  disableSearch: false,
  deleteAlertContent: "",
  udfValueStrings: {}
};

export default UdfSelector;
