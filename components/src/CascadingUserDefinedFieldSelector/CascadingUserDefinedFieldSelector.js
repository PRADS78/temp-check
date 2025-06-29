import { Component } from "react";
import AppButton from "../AppButton/AppButton";
import RequiredField from "../RequiredField/RequiredField";
import DropDown from "../DropDown/DropDown";
import PropTypes from "prop-types";
import MultiSelectDropDown from "../MultiSelectDropDown/MultiSelectDropDown";
import withLocalizerContext from "../HOC/withLocalizerContext";

class CascadingUserDefinedFieldSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFieldsAndValues: this.props.selectedFieldsAndValues,
    };
  }

  componentDidMount() {
    if (!this.props.disableAdminRestrictions) {
      this.getDefaultSelectionsAndUpdateParent();
    }
  }

  getDefaultSelectionsAndUpdateParent = () => {
    if (this.props.isRestrictedAdminUser && this.props.updateOnRender) {
      let udfFields = this.props.userDefinedFields;
      udfFields.forEach((field, index) => {
        if (field.isListType()) {
          let selectedValues = [];
          if (!field.fieldValues || field.fieldValues.length === 0) {
            field.allowedValues.map((value) => {
              if (this.props.isRestrictedAdminUser && field.isListType()) {
                let adminRestrictionData =
                  this.props.user.restrictedAdminConfiguration;
                let selectedField = adminRestrictionData.find((data) => {
                  return data.fieldId === field.fieldId;
                });
                if (selectedField) {
                  adminRestrictionData.forEach(function (data) {
                    data.listItemIds.forEach(function (listItemId) {
                      let selectedItem = field.allowedValues.find(function (
                        allowedValue
                      ) {
                        return allowedValue.listItemId === listItemId;
                      });
                      if (selectedItem) {
                        if (this.props.allowValuesMultiSelect) {
                          let existing = selectedValues.find(function (value) {
                            return value.value === selectedItem.listItemId;
                          });
                          if (!existing) {
                            selectedValues.push({
                              value: selectedItem.listItemId,
                            });
                          }
                        } else {
                          selectedValues = [{ value: selectedItem.listItemId }];
                        }
                      }
                    });
                  });
                }
              }
            });
            this.setUdfTarget(field, selectedValues, null);
          } else if (field.fieldValues) {
            field.fieldValues.forEach((value) => {
              selectedValues.push({ value: value });
            });
            this.setUdfTarget(field, selectedValues, null);
          }
        }
      }, this);
    }
  };

  render() {
    return (
      <div className={"udf-filters-ctr " + this.props.containerCls}>
        {this.renderUdfOptions()}
      </div>
    );
  }

  renderUdfValueOptions = (udfField, restrictionAdminData, isNotSelectable) => {
    let me = this;
    let selectedValues;
    let conditionValues = [];
    let dropDownOptions = udfField.allowedValues.map((value) => {
      try {
        let fieldCondition = value.listItemCondition
          ? JSON.parse(value.listItemCondition)
          : null;
        if (udfField.dependent && fieldCondition && fieldCondition.criteria) {
          fieldCondition.criteria.forEach((criteria) => {
            if (me.props.selectedFieldsAndValues.length > 0) {
              me.props.selectedFieldsAndValues.forEach(function (field) {
                if (field.fieldId === criteria.fieldId) {
                  field.fieldValues.forEach(function (value) {
                    if (!conditionValues.includes(value)) {
                      conditionValues.push(parseInt(value));
                    }
                  });
                }
              });
            }
          });
          if (conditionValues.length > 0) {
            let availableValues = [];
            fieldCondition.criteria.map((criteria) => {
              criteria.listItemIds.forEach((listItemId) => {
                availableValues.push(listItemId);
              });
            });

            let conditionSatisfied = conditionValues.every((value) => {
              return availableValues.indexOf(value) >= 0;
            });
            if (conditionSatisfied) {
              return {
                value: value.listItemId,
                label: value.listItemValue,
                listItemId: value.listItemId,
                fieldId: udfField.fieldId,
              };
            }
          } else {
            return {
              value: value.listItemId,
              label: value.listItemValue,
              listItemId: value.listItemId,
              fieldId: udfField.fieldId,
            };
          }
        } else {
          return {
            value: value.listItemId,
            label: value.listItemValue,
            listItemId: value.listItemId,
            fieldId: udfField.fieldId,
          };
        }
      } catch (e) {
        console.log(e);
      }
    });

    let selectedUDFField = this.props.selectedFieldsAndValues.find(
      (currentField) => {
        return currentField.fieldId === udfField.fieldId;
      }
    );

    if (!selectedUDFField) {
      if (udfField.isListType() && this.props.allowValuesMultiSelect) {
        selectedValues = [];
      } else {
        selectedValues = "";
      }
    } else {
      if (udfField.isListType() && this.props.allowValuesMultiSelect) {
        selectedValues = selectedUDFField.fieldValues;
      } else {
        selectedValues =
          selectedUDFField.fieldValues.length > 0
            ? selectedUDFField.fieldValues[0]
            : "";
      }
    }

    let cleanedValueItems = [];
    for (let i = 0; i < dropDownOptions.length; i++) {
      if (dropDownOptions[i]) {
        cleanedValueItems.push(dropDownOptions[i]);
      }
    }

    if (
      this.props.isRestrictedAdminUser &&
      udfField.isListType() &&
      !this.props.disableAdminRestrictions
    ) {
      let adminRestrictionData = me.props.user.restrictedAdminConfiguration;
      let selectedField = adminRestrictionData.find(function (data) {
        return data.fieldId === udfField.fieldId;
      });
      if (selectedField) {
        cleanedValueItems = dropDownOptions.filter(function (option) {
          return (
            option && selectedField.listItemIds.includes(option.listItemId)
          );
        });
        if (
          typeof selectedValues === "undefined" ||
          selectedValues === null ||
          selectedValues.length === 0
        ) {
          selectedValues = [];
          adminRestrictionData.forEach(function (data) {
            data.listItemIds.forEach(function (listItemId) {
              let selectedItem = udfField.allowedValues.find(function (
                allowedValue
              ) {
                return allowedValue.listItemId === listItemId;
              });
              if (selectedItem) {
                if (this.props.allowValuesMultiSelect) {
                  if (!selectedValues.includes(selectedItem.listItemId)) {
                    selectedValues.push(selectedItem.listItemId);
                  }
                } else {
                  selectedValues = selectedItem.listItemId;
                }
              }
            }, this);
          }, this);
        }
      }
    }

    cleanedValueItems.sort(function (first, second) {
      let firstLabel = first.label.trim();
      let secondLabel = second.label.trim();
      if (firstLabel < secondLabel) {
        return -1;
      }
      if (firstLabel > secondLabel) {
        return 1;
      }
      return 0;
    });

    let searchTypeInput = "";
    if (udfField.isListType()) {
      const selVal = selectedValues.map((val) => ({
        ...val,
        label: val.label,
        value: val.value,
      }));
      searchTypeInput = this.props.allowValuesMultiSelect ? (
        <MultiSelectDropDown
          key={new Date().valueOf()}
          ctrCls={"type-selector " + this.props.fieldCls}
          items={cleanedValueItems}
          values={selVal}
          onSelect={this.setUdfTarget.bind(this, udfField)}
        />
      ) : (
        <DropDown
          key={!this.props.allowValuesMultiSelect ? new Date().valueOf() : 1}
          ctrCls={"type-selector " + this.props.fieldCls}
          menuPosition={"fixed"}
          clearable={this.props.allowValuesMultiSelect}
          searchable={this.props.allowValuesMultiSelect}
          value={selectedValues}
          optionRenderer={this.props.optionRenderer}
          valueRenderer={this.props.valueRenderer}
          disabled={this.props.isDisabledEdit}
          isMulti={this.props.allowValuesMultiSelect}
          closeMenuOnSelect={!this.props.allowValuesMultiSelect}
          backspaceToRemoveMessage={""}
          onSelect={this.setUdfTarget.bind(this, udfField)}
          items={cleanedValueItems}
        />
      );
    } else {
      searchTypeInput = (
        <input
          type="text"
          value={selectedValues}
          className={"string-type-input input-item " + this.props.fieldCls}
          onChange={this.updateStringTypeUdfValue.bind(this, udfField)}
          disabled={this.props.isDisabledEdit}
          onBlur={this.setUdfTarget.bind(this, udfField)}
          title={udfField.fieldName}
          placeholder={this.props.t("cascadingUserDefinedFieldSelector.searchPlaceholder", {fieldName: udfField.fieldName})}
        />
      );
    }
    return searchTypeInput;
  };

  updateStringTypeUdfValue = (field, event) => {
    let value = event.currentTarget.value;
    let udfSelectedValues = this.props.selectedFieldsAndValues;
    let existingUDFField = udfSelectedValues.find(function (udfField) {
      return udfField.fieldId === field.fieldId;
    });
    if (value) {
      if (existingUDFField) {
        existingUDFField.fieldValues = [value];
      } else {
        udfSelectedValues.push({
          fieldId: field.fieldId,
          fieldType: field.fieldType,
          fieldValues: [value],
        });
      }
    } else if (!this.props.allFieldsVisible) {
      udfSelectedValues.findAndRemove(function (udfField) {
        return udfField.fieldId === field.fieldId;
      });
    } else {
      if (existingUDFField) {
        existingUDFField.fieldValues = [value];
      }
    }
    this.props.onChange(udfSelectedValues);
  };

  setUdfTarget = (currentUdfField, selectedFieldValues, event) => {
    let udfSelectedValues = this.props.selectedFieldsAndValues;
    let existingUDFField = udfSelectedValues.find(function (udfField) {
      return udfField.fieldId === currentUdfField.fieldId;
    });
    let values = selectedFieldValues || [];
    if (!existingUDFField) {
      if (currentUdfField.fieldType.toLowerCase() === "list") {
        if (this.props.allowValuesMultiSelect) {
          values = values.map(function (data) {
            return data;
          });
        } else {
          values = selectedFieldValues;
        }
        udfSelectedValues.push({
          fieldId: currentUdfField.fieldId,
          fieldLabel: currentUdfField.fieldName,
          fieldType: currentUdfField.fieldType,
          fieldValues: values,
        });
      }
    } else {
      udfSelectedValues.forEach(function (udfField) {
        if (udfField.fieldId === currentUdfField.fieldId) {
          if (currentUdfField.fieldType.toLowerCase() === "list") {
            if (this.props.allowValuesMultiSelect) {
              values = values.map(function (data) {
                return data;
              });
            } else {
              values = selectedFieldValues;
            }
            udfField["fieldValues"] = values;
          }
        }
      }, this);
    }

    if (this.props.allFieldsVisible) {
      udfSelectedValues.forEach(function (udfField) {
        if (
          currentUdfField.fieldType.toLowerCase() === "list" &&
          udfField.fieldValues &&
          udfField.fieldValues.length === 0
        ) {
          udfSelectedValues.findAndRemove((item) => {
            return udfField.fieldId === item.fieldId;
          });
        }
      });
    }
    if (
      this.props.isRestrictedAdminUser &&
      !this.props.disableAdminRestrictions
    ) {
      udfSelectedValues.forEach((udfField) => {
        let adminRestrictedFieldData =
          this.props.user.restrictedAdminConfiguration.find(function (data) {
            return data.fieldId === udfField.fieldId;
          });
        if (adminRestrictedFieldData && udfField.fieldValues.length === 0) {
          udfField.fieldValues = adminRestrictedFieldData.listItemIds;
        }
      }, this);
    }
    this.props.onChange(udfSelectedValues);
  };

  renderUdfOptions = () => {
    let udfFields = this.props.userDefinedFields,
      udfOptions = [];
    let toAddRestrictedAdminCondition = false;
    udfFields.forEach((field, index) => {
      if (
        this.props.isRestrictedAdminUser &&
        !this.props.disableAdminRestrictions
      ) {
        let adminRestrictionData = this.props.user.restrictedAdminConfiguration;
        let restrictionData = adminRestrictionData.find(function (data) {
          return data.fieldId === field.fieldId;
        });
        toAddRestrictedAdminCondition =
          typeof restrictionData !== "undefined" && restrictionData !== null;
      }
      let selectedUdfFieldIds = [];
      if (!this.props.allFieldsVisible) {
        selectedUdfFieldIds = this.props.selectedFieldsAndValues.map(function (
          data
        ) {
          return data.fieldId;
        });

        // Only Selected Udfs to be displayed
        if (
          selectedUdfFieldIds.length > 0 &&
          index >= selectedUdfFieldIds.length
        ) {
          return;
        }
      }

      let selectedValue = 0;
      if (index < this.props.selectedFieldsAndValues.length) {
        selectedValue = this.props.selectedFieldsAndValues[index].fieldId;
      }

      let filteredUdfs = udfFields.filter(function (udfValue) {
        return (
          !selectedUdfFieldIds.includes(udfValue.fieldId) ||
          selectedValue === udfValue.fieldId
        );
      }, this);

      let selectedField = field;
      if (selectedValue !== 0 && !this.props.allFieldsVisible) {
        selectedField = udfFields.find(function (field) {
          return field.fieldId === selectedValue;
        });
      }

      let udfFieldOptions = filteredUdfs.map(function (fieldRecord) {
        return {
          value: fieldRecord.fieldId,
          label: fieldRecord.fieldName,
          dependent: fieldRecord.dependent,
          fieldId: fieldRecord.fieldId,
        };
      });

      let udfOption = "";
      if (this.props.allFieldsVisible) {
        udfOption = <div className={"input-label-item"}>{field.fieldName}</div>;
      } else {
        udfOption = (
          <DropDown
            ctrCls={"udf-field-selector " + this.props.udfFieldCls}
            clearable={false}
            menuPosition={"fixed"}
            disabled={
              toAddRestrictedAdminCondition || this.props.isDisabledEdit
            }
            onChange={this.setUdfField.bind(this, field.fieldId, index)}
            value={selectedValue}
            items={udfFieldOptions}
          />
        );
      }

      // Acc to https://medium.com/@Carmichaelize/dynamic-tag-names-in-react-and-jsx-17e366a684e9
      let isDisplayComponentNeeded =
        field.isMandatory &&
        this.props.allFieldsVisible &&
        this.props.showMandatory;
      let MetaDataFieldDisplayComponent = isDisplayComponentNeeded
        ? RequiredField
        : "div";
      let attributes = {};
      attributes[
        isDisplayComponentNeeded ? "ctrCls" : "className"
      ] = `setting-row udf-option ${
        this.props.ctrCls
      } ${field.curateForCssClassname()}`;

      let addBtn =
        this.props.showAddBtn &&
        this.props.selectedFieldsAndValues.length < udfFields.length &&
        index === 0 &&
        !this.props.allFieldsVisible ? (
          <div className={"button-container"}>
            <AppButton
              buttonCls={"add-btn filled-button"}
              buttonLabel={this.props.t("cascadingUserDefinedFieldSelector.addButtonLbl")}
              clickHandler={this.props.onAddBtnClick}
            />
          </div>
        ) : (
          ""
        );

      udfOptions.push(
        <MetaDataFieldDisplayComponent {...attributes} key={"udf" + index}>
          {udfOption}
          {this.renderUdfValueOptions(
            selectedField,
            toAddRestrictedAdminCondition,
            selectedValue !== 0
          )}
          {addBtn}
          {index > 0 && !this.props.allFieldsVisible && (
            <div className={"delete-button-container"}>
              <AppButton
                buttonCls={"delete-btn filled-button"}
                buttonIconCls={"icon-close-delete"}
                clickHandler={this.deleteUdfCondition.bind(
                  this,
                  field.fieldId,
                  index
                )}
              />
            </div>
          )}
        </MetaDataFieldDisplayComponent>
      );
    }, this);

    return udfOptions;
  };

  setUdfField = (fieldId, index, selectedUdf) => {
    let selectedFieldsAndValues = this.props.selectedFieldsAndValues;
    let selectedField = this.props.userDefinedFields.find(function (criterion) {
      return criterion.fieldId === selectedUdf.value;
    });
    selectedField.listItemIds = [];
    selectedField.fieldValues = [];
    selectedFieldsAndValues[index] = selectedField;
    this.props.onChange(selectedFieldsAndValues);
  };

  deleteUdfCondition = (fieldId, index) => {
    let selectedFieldsAndValues = this.props.selectedFieldsAndValues;
    selectedFieldsAndValues.splice(index, 1);
    this.props.onChange(selectedFieldsAndValues);
  };
}

CascadingUserDefinedFieldSelector.propTypes = {
  user: PropTypes.object,
  allFieldsVisible: PropTypes.bool,
  userDefinedFields: PropTypes.array,
  selectedFieldsAndValues: PropTypes.array,
  fieldOrdering: PropTypes.array,
  allowValuesMultiSelect: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  ctrCls: PropTypes.string,
  containerCls: PropTypes.string,
  fieldCls: PropTypes.string,
  udfFieldCls: PropTypes.string,
  isDisabledEdit: PropTypes.bool,
  showMandatory: PropTypes.bool,
  onAddBtnClick: PropTypes.func,
  showAddBtn: PropTypes.bool,
  optionRenderer: PropTypes.func,
  valueRenderer: PropTypes.func,
  updateOnRender: PropTypes.bool,
  disableAdminRestrictions: PropTypes.bool,
};
CascadingUserDefinedFieldSelector.defaultProps = {
  allFieldsVisible: false,
  userDefinedFields: [],
  selectedFieldsAndValues: [],
  fieldOrdering: [],
  allowValuesMultiSelect: false,
  ctrCls: "",
  fieldCls: "",
  containerCls: "",
  udfFieldCls: "",
  isDisabledEdit: false,
  showMandatory: false,
  showAddBtn: false,
  updateOnRender: false,
  onAddBtnClick: () => {},
  disableAdminRestrictions: false,
};

export default withLocalizerContext(CascadingUserDefinedFieldSelector);
