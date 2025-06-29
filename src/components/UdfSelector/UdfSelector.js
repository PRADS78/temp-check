import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import * as Service from "../../Service/Service";
import { UserDefinedField } from "../../Models/UserDefinedField";
import styles from "./UdfSelector.module.scss";
import { Plus } from "@disprz/icons";
import { UdfActions } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { DropDownPosition } from "../../Enums/index";
import UdfItem from "./UdfItem";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";
import { Tooltip } from "../Tooltip";

const UdfSelector = ({
  ctrCls,
  leftDropDownCustomization,
  rightDropDownCustomization,
  udfFetchAPiUrl,
  accessToken,
  defaultValues,
  onAdd,
  onRemove,
  uniqueId,
  canHideUdfsWithZeroUsers,
  maxNoOfUdfToSelect,
  limitExceedsMessage,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Udf Selector");
    invariantUniqueId(uniqueId, "Udf Selector");
  }, [automationIdPrefix, uniqueId]);

  const allUdfDetails = useRef();
  const udfDefaultValue = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [leftDropdownItems, setLeftDropdownItems] = useState([]);
  const [rightDropdownItems, setRightDropdownItems] = useState([
    {
      id: -1,
      items: [],
    },
  ]);
  const [filteredUDFs, setFilteredUDFs] = useState([
    {
      udfFieldId: -1,
      udfFieldLabel: "",
      udfFieldValues: [],
    },
  ]);
  const [tooltipRef, setTooltipRef] = useState(null);
  const [isExceedsLimit, setIsExceedsLimit] = useState(false);

  const formatToLabelValue = (arr, labelKey, valueKey) => {
    return arr.reduce((a, c) => {
      const entry = {
        label: c[labelKey],
        value: c[valueKey],
      };
      a.push(entry);
      return a;
    }, []);
  };

  useEffect(() => {
    if (maxNoOfUdfToSelect !== null) {
      setIsExceedsLimit(filteredUDFs.length >= maxNoOfUdfToSelect);
    }
  }, [filteredUDFs, maxNoOfUdfToSelect]);

  useEffect(() => {
    setIsLoading(true);
    Service.getLimitedUserDefinedFieldsSummary(
      udfFetchAPiUrl,
      accessToken
    ).then((response) => {
      const userDefinedFields = response
        ?.map((udf) => {
          return new UserDefinedField(udf, canHideUdfsWithZeroUsers);
        })
        ?.filter((userDefinedField) => {
          return (
            userDefinedField.fieldType === "List" &&
            userDefinedField.allowedValues.length > 0
          );
        });
      allUdfDetails.current = userDefinedFields;
      const udfItemList = formatToLabelValue(
        allUdfDetails.current,
        "fieldName",
        "fieldId"
      );
      setLeftDropdownItems(udfItemList);
      const udfValuesItemList = allUdfDetails.current?.map((udf) => {
        return {
          id: udf.fieldId,
          items: formatToLabelValue(
            udf.allowedValues,
            "listItemValue",
            "listItemId"
          ),
        };
      });
      setRightDropdownItems(udfValuesItemList);
      onChangeDefaultValues();
      setIsLoading(false);
    });
  }, [
    udfFetchAPiUrl,
    accessToken,
    onChangeDefaultValues,
    canHideUdfsWithZeroUsers,
  ]);

  const onChangeDefaultValues = useCallback(() => {
    if (defaultValues.length > 0) {
      const defaultSelectedUDFs = defaultValues.map((defaultUdf) => {
        const selectedUdf = allUdfDetails.current.find(
          (udf) => udf.fieldId === defaultUdf.udfFieldId
        );
        const fieldValues = selectedUdf.allowedValues.filter((values) => {
          return defaultUdf.udfFieldValues?.includes(values.listItemId);
        });
        return {
          udfFieldId: defaultUdf.udfFieldId,
          udfFieldLabel: selectedUdf.fieldName,
          udfFieldValues: formatToLabelValue(
            fieldValues,
            "listItemValue",
            "listItemId"
          ),
        };
      });
      setFilteredUDFs(defaultSelectedUDFs);
    }
  }, [defaultValues]);

  useEffect(() => {
    switch (udfDefaultValue.current) {
      case UdfActions.UDF_ADD: {
        onAdd(filteredUDFs);
        udfDefaultValue.current = null;
        break;
      }
      case UdfActions.UDF_REMOVE: {
        const filteredValue = filteredUDFs.filter((udf) => {
          return udf.udfFieldId === -1 ? null : udf;
        });
        onRemove(filteredValue);
        udfDefaultValue.current = null;
        break;
      }
    }
  }, [filteredUDFs, onAdd, onRemove]);

  const onChangeLeftDropdownItems = (values, rowIndex) => {
    const udfObj = {
      udfFieldId: values.value,
      udfFieldLabel: values.label,
      udfFieldValues: [],
    };
    if (filteredUDFs[rowIndex].udfFieldId !== values.value) {
      setFilteredUDFs((prevState) =>
        prevState.map((udf, i) => {
          if (rowIndex === i) {
            return udfObj;
          }
          return udf;
        })
      );
    }
    udfDefaultValue.current = UdfActions.UDF_ADD;
  };

  const onChangeRightDropdownItems = useCallback((values, rowIndex) => {
    setFilteredUDFs((prevState) =>
      prevState.map((udf, i) => {
        if (rowIndex === i) {
          return {
            ...udf,
            udfFieldValues: values,
          };
        }
        return udf;
      })
    );
    udfDefaultValue.current = UdfActions.UDF_ADD;
  }, []);

  const onRemoveClick = (rowIndex) => {
    let filteredUDF = [...filteredUDFs];
    filteredUDF.splice(rowIndex, 1);
    setFilteredUDFs(filteredUDF);
    if (filteredUDF.length < 1) {
      onAddClick();
    }
    udfDefaultValue.current = UdfActions.UDF_REMOVE;
  };

  const onAddClick = () => {
    const addNewRow = {
      udfFieldId: -1,
      udfFieldLabel: "",
      udfFieldValues: [],
    };
    setFilteredUDFs((prevState) => prevState.concat(addNewRow));
  };

  const renderAddButton = () => {
    let isDisabled =
      filteredUDFs[filteredUDFs.length - 1].udfFieldId !== -1 &&
      filteredUDFs.every((udf) => {
        return udf.udfFieldValues.length > 0;
      }) &&
      leftDropdownItems.length !== filteredUDFs.length;
    if (maxNoOfUdfToSelect !== null) {
      isDisabled = !(isDisabled && filteredUDFs.length < maxNoOfUdfToSelect);
    } else {
      isDisabled = !isDisabled;
    }
    return (
      <Plus
        className={`squared ${styles.plus}`}
        onClick={onAddClick}
        isDisabled={isDisabled}
        data-role="add"
        uniqueId={1667217412978}
        ref={setTooltipRef}
      />
    );
  };

  if (isLoading) {
    return (
      <div className={styles.udfSelector}>
        <div>{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div
      className={styles.udfSelector}
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-udf-selector`}
    >
      {filteredUDFs?.map((udf, index) => {
        const leftItems = leftDropdownItems.filter((leftItems) => {
          const filterLeftItems = filteredUDFs?.some((filtered) => {
            return (
              filtered.udfFieldLabel === leftItems.label &&
              filteredUDFs[index].udfFieldLabel !== leftItems.label
            );
          });
          return !filterLeftItems;
        });
        const rightItems = rightDropdownItems.find((rightItems) => {
          return rightItems.id === udf.udfFieldId;
        });
        const currentUdf = filteredUDFs[index];
        return (
          <UdfItem
            key={udf.udfFieldId}
            leftDropDownCustomization={leftDropDownCustomization}
            rightDropDownCustomization={rightDropDownCustomization}
            leftItems={leftItems}
            rightItems={rightItems}
            currentUdf={currentUdf}
            onChangeLeftDropdownItems={onChangeLeftDropdownItems}
            onChangeRightDropdownItems={onChangeRightDropdownItems}
            onRemove={onRemoveClick}
            index={index}
            ctrCls={ctrCls}
          />
        );
      })}
      {renderAddButton()}
      {isExceedsLimit && (
        <Tooltip
          referenceRef={tooltipRef}
          uniqueId={1719640502374}
          message={limitExceedsMessage}
        />
      )}
    </div>
  );
};

UdfSelector.propTypes = {
  /**
   * Specify ctrCls for the UDF field dropdown parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * Specify options for the left dropdown
   */
  leftDropDownCustomization: PropTypes.shape({
    ctrCls: PropTypes.string,
    placeholder: PropTypes.string,
    intersectionRef: PropTypes.any,
    position: PropTypes.oneOf([DropDownPosition.BOTTOM, DropDownPosition.TOP]),
    canUsePortal: PropTypes.bool,
    maxHeight: PropTypes.number,
  }),
  /**
   * Specify options for the right dropdown
   */
  rightDropDownCustomization: PropTypes.shape({
    ctrCls: PropTypes.string,
    placeholder: PropTypes.string,
    intersectionRef: PropTypes.any,
    position: PropTypes.oneOf([DropDownPosition.BOTTOM, DropDownPosition.TOP]),
    canUsePortal: PropTypes.bool,
    maxHeight: PropTypes.number,
  }),
  /**
   * Specify the full url to fetch UDFs
   */
  udfFetchAPiUrl: PropTypes.string.isRequired,
  /**
   * Specify the token required to call UDF service
   */
  accessToken: PropTypes.string.isRequired,
  /**
   * Specify the default value of UDF value
   * **NOTE: udfFieldValues should be an array**
   */
  defaultValues: PropTypes.arrayOf(
    PropTypes.shape({
      udfFieldId: PropTypes.number,
      udfFieldValues: PropTypes.number, //
    })
  ),
  /**
   * Specify onAdd for an UDF when a value is selected in right side dropdown
   */
  onAdd: PropTypes.func.isRequired,
  /**
   * Specify onRemove for an UDF when minus icon is pressed
   */
  onRemove: PropTypes.func.isRequired,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Specify whether to filter udf values which have no users assigned under it
   */
  canHideUdfsWithZeroUsers: PropTypes.bool,
  /**
   * Specify the maximum no of udf to select
   */
  maxNoOfUdfToSelect: PropTypes.number,
  /**
   * Specify the tooltip message for limit exceeds
   */
  limitExceedsMessage: PropTypes.string,
};

/* istanbul ignore next */
UdfSelector.defaultProps = {
  ctrCls: "",
  leftDropDownCustomization: {
    ctrCls: "",
    placeholder: "",
    intersectionRef: undefined,
    menuPlacement: DropDownPosition.BOTTOM,
    canUsePortal: false,
    maxHeight: null,
  },
  rightDropDownCustomization: {
    ctrCls: "",
    placeholder: "",
    intersectionRef: undefined,
    menuPlacement: DropDownPosition.BOTTOM,
    canUsePortal: false,
    maxHeight: null,
  },
  defaultValues: [],
  canHideUdfsWithZeroUsers: false,
  maxNoOfUdfToSelect: null,
  limitExceedsMessage: "Udf Limit Exceeded!",
};

export default UdfSelector;
