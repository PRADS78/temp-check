import { FIELD_TYPES, UDF_FIELD_TYPES } from "./form-schema";

export const INPUT_FIELDS = [
  {
    id: FIELD_TYPES.SHORT_TEXT,
    type: FIELD_TYPES.SHORT_TEXT,
    label: "Short Text",
    icon: "📝",
    description: "Single line text input",
  },
  {
    id: FIELD_TYPES.LONG_TEXT,
    type: FIELD_TYPES.LONG_TEXT,
    label: "Long Text",
    icon: "📄",
    description: "Multi-line text input",
  },
  {
    id: FIELD_TYPES.DATE_PICKER,
    type: FIELD_TYPES.DATE_PICKER,
    label: "Date Picker",
    icon: "📅",
    description: "Date selection field",
  },
  {
    id: FIELD_TYPES.DROPDOWN,
    type: FIELD_TYPES.DROPDOWN,
    label: "Dropdown",
    icon: "📋",
    description: "Single or multiple choice selection",
  },
  {
    id: FIELD_TYPES.FILE_UPLOAD,
    type: FIELD_TYPES.FILE_UPLOAD,
    label: "File Upload",
    icon: "📎",
    description: "File upload field",
  },
  {
    id: FIELD_TYPES.NUMBER,
    type: FIELD_TYPES.NUMBER,
    label: "Number",
    icon: "🔢",
    description: "Numeric input field",
  },
];

export const UDF_FIELDS = [
  {
    id: UDF_FIELD_TYPES.DESIGNATION,
    type: FIELD_TYPES.UDF,
    udfType: UDF_FIELD_TYPES.DESIGNATION,
    label: "Designation",
    icon: "👔",
    description: "Job designation field",
  },
  {
    id: UDF_FIELD_TYPES.DEPARTMENT,
    type: FIELD_TYPES.UDF,
    udfType: UDF_FIELD_TYPES.DEPARTMENT,
    label: "Department",
    icon: "🏢",
    description: "Department selection field",
  },
  {
    id: UDF_FIELD_TYPES.LOCATION,
    type: FIELD_TYPES.UDF,
    udfType: UDF_FIELD_TYPES.LOCATION,
    label: "Location",
    icon: "📍",
    description: "Location field",
  },
  {
    id: UDF_FIELD_TYPES.BLOOD_GROUP,
    type: FIELD_TYPES.UDF,
    udfType: UDF_FIELD_TYPES.BLOOD_GROUP,
    label: "Blood Group",
    icon: "🩸",
    description: "Blood group selection",
  },
  {
    id: UDF_FIELD_TYPES.EDUCATION,
    type: FIELD_TYPES.UDF,
    udfType: UDF_FIELD_TYPES.EDUCATION,
    label: "Education",
    icon: "🎓",
    description: "Education level field",
  },
];

export const getFieldConfig = (fieldType, udfType = null) => {
  if (fieldType === FIELD_TYPES.UDF && udfType) {
    return UDF_FIELDS.find((field) => field.udfType === udfType);
  }
  return INPUT_FIELDS.find((field) => field.type === fieldType);
};

export const getAllFieldTypes = () => [...INPUT_FIELDS, ...UDF_FIELDS];

export const getFieldsByCategory = () => ({
  inputFields: INPUT_FIELDS,
  udfFields: UDF_FIELDS,
});
