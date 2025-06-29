import {
  DisprzTextField,
  DisprzTextArea,
  DisprzDatePicker,
  DisprzDropDown,
  DisprzRadioButton,
  DisprzUdfSelector,
} from "../../../../src/remote";
import { FIELD_TYPES, UDF_FIELD_TYPES } from "../../lib/form-schema";
import {
  TextFieldTypes,
  DatePickerTypes,
  DropDownOptionTypes,
} from "../../../../src/Enums";
import styles from "./FieldRenderer.module.scss";

const FieldRenderer = ({ field, value, onChange, error, disabled }) => {
  const handleFieldChange = (newValue) => {
    onChange(newValue);
  };

  const renderFieldByType = () => {
    switch (field.type) {
      case FIELD_TYPES.SHORT_TEXT:
        return (
          <DisprzTextField
            uniqueId={`field_${field.id}_${Date.now()}`}
            type={TextFieldTypes.TEXT}
            value={value || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={field.placeholder || "Enter text"}
            maxLength={field.maxLength}
            isDisabled={disabled}
            required={field.required}
            errorMessage={error?.[0]}
            borderGapColor="var(--primary)"
          />
        );

      case FIELD_TYPES.LONG_TEXT:
        return (
          <DisprzTextArea
            uniqueId={`field_${field.id}_${Date.now()}`}
            value={value || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder={field.placeholder || "Enter text"}
            maxLength={field.maxLength}
            isDisabled={disabled}
            required={field.required}
            errorMessage={error?.[0]}
            rows={4}
          />
        );

      case FIELD_TYPES.DATE_PICKER:
        return (
          <DisprzDatePicker
            uniqueId={`field_${field.id}_${Date.now()}`}
            type={DatePickerTypes.STANDARD}
            defaultDates={value ? [new Date(value)] : []}
            onChange={(dates) => handleFieldChange(dates[0]?.toISOString())}
            dateFormat={field.dateFormat || "MM/DD/YYYY"}
            isDisabled={disabled}
            placeholder="Select date"
          />
        );

      case FIELD_TYPES.DROPDOWN:
        const dropdownItems =
          field.options?.map((option) => ({
            label: option.label,
            value: option.id,
            id: option.id,
          })) || [];

        return (
          <DisprzDropDown
            uniqueId={`field_${field.id}_${Date.now()}`}
            items={dropdownItems}
            value={value || (field.allowMultiple ? [] : null)}
            onChange={(selectedValue) => handleFieldChange(selectedValue)}
            placeholder={field.placeholder || "Select option"}
            isMulti={field.allowMultiple || false}
            isDisabled={disabled}
            itemsType={DropDownOptionTypes.STANDARD}
            isClearable={!field.required}
          />
        );

      case FIELD_TYPES.NUMBER:
        return (
          <DisprzTextField
            uniqueId={`field_${field.id}_${Date.now()}`}
            type={TextFieldTypes.NUMBER}
            value={value || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
            placeholder="Enter number"
            min={field.min}
            max={field.max}
            isDisabled={disabled}
            required={field.required}
            errorMessage={error?.[0]}
            borderGapColor="var(--primary)"
          />
        );

      case FIELD_TYPES.FILE_UPLOAD:
        return (
          <div className={styles.fileUploadWrapper}>
            <div className={styles.fileUploadPlaceholder}>
              <span>📎 File Upload Field</span>
              <small>
                File upload component requires backend configuration
              </small>
            </div>
          </div>
        );

      case FIELD_TYPES.UDF:
        if (field.udfType === UDF_FIELD_TYPES.DESIGNATION) {
          return (
            <DisprzUdfSelector
              uniqueId={`field_${field.id}_${Date.now()}`}
              udfFetchAPiUrl="/api/udf"
              accessToken="demo-token"
              defaultValues={value ? [value] : []}
              onAdd={(udf) => handleFieldChange(udf)}
              onRemove={() => handleFieldChange(null)}
            />
          );
        }

        // For other UDF types, use dropdown
        const udfOptions = getUdfOptions(field.udfType);
        return (
          <DisprzDropDown
            uniqueId={`field_${field.id}_${Date.now()}`}
            items={udfOptions}
            value={value || null}
            onChange={(selectedValue) => handleFieldChange(selectedValue)}
            placeholder={`Select ${field.label}`}
            isDisabled={disabled}
            itemsType={DropDownOptionTypes.STANDARD}
            isClearable={!field.required}
          />
        );

      default:
        return (
          <div className={styles.unsupportedField}>
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  const getUdfOptions = (udfType) => {
    switch (udfType) {
      case UDF_FIELD_TYPES.DEPARTMENT:
        return [
          { label: "Engineering", value: "engineering", id: "eng" },
          { label: "Marketing", value: "marketing", id: "mkt" },
          { label: "Sales", value: "sales", id: "sales" },
          { label: "HR", value: "hr", id: "hr" },
        ];
      case UDF_FIELD_TYPES.LOCATION:
        return [
          { label: "New York", value: "ny", id: "ny" },
          { label: "San Francisco", value: "sf", id: "sf" },
          { label: "London", value: "london", id: "london" },
          { label: "Remote", value: "remote", id: "remote" },
        ];
      case UDF_FIELD_TYPES.BLOOD_GROUP:
        return [
          { label: "A+", value: "a_positive", id: "a_pos" },
          { label: "A-", value: "a_negative", id: "a_neg" },
          { label: "B+", value: "b_positive", id: "b_pos" },
          { label: "B-", value: "b_negative", id: "b_neg" },
          { label: "O+", value: "o_positive", id: "o_pos" },
          { label: "O-", value: "o_negative", id: "o_neg" },
          { label: "AB+", value: "ab_positive", id: "ab_pos" },
          { label: "AB-", value: "ab_negative", id: "ab_neg" },
        ];
      case UDF_FIELD_TYPES.EDUCATION:
        return [
          { label: "High School", value: "high_school", id: "hs" },
          { label: "Bachelor's Degree", value: "bachelors", id: "bach" },
          { label: "Master's Degree", value: "masters", id: "mast" },
          { label: "PhD", value: "phd", id: "phd" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldLabel}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </div>

      {field.showDescription && field.description && (
        <div className={styles.fieldDescription}>{field.description}</div>
      )}

      <div className={styles.fieldInput}>{renderFieldByType()}</div>

      {error && error.length > 0 && (
        <div className={styles.fieldError}>{error[0]}</div>
      )}
    </div>
  );
};

export default FieldRenderer;
