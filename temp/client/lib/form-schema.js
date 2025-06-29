// Form schema structure for the form builder

export const FIELD_TYPES = {
  SHORT_TEXT: "short_text",
  LONG_TEXT: "long_text",
  DATE_PICKER: "date_picker",
  DROPDOWN: "dropdown",
  FILE_UPLOAD: "file_upload",
  NUMBER: "number",
  UDF: "udf",
};

export const UDF_FIELD_TYPES = {
  DESIGNATION: "designation",
  DEPARTMENT: "department",
  LOCATION: "location",
  BLOOD_GROUP: "blood_group",
  EDUCATION: "education",
};

export const DATE_FORMATS = {
  MM_DD_YYYY: "MM/DD/YYYY",
  YYYY_MM_DD: "YYYY/MM/DD",
  DD_MM_YYYY: "DD/MM/YYYY",
};

export const createField = (type, overrides = {}) => {
  const baseField = {
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: "",
    description: "",
    required: false,
    showDescription: false,
    sectionId: null,
    order: 0,
    ...overrides,
  };

  switch (type) {
    case FIELD_TYPES.SHORT_TEXT:
      return {
        ...baseField,
        label: "Untitled Question",
        placeholder: "Short Text (Up to 100 Characters)",
        maxLength: 100,
      };

    case FIELD_TYPES.LONG_TEXT:
      return {
        ...baseField,
        label: "Untitled Question",
        placeholder: "Long Text",
        maxLength: 1000,
      };

    case FIELD_TYPES.DATE_PICKER:
      return {
        ...baseField,
        label: "Untitled Question",
        dateFormat: DATE_FORMATS.MM_DD_YYYY,
      };

    case FIELD_TYPES.DROPDOWN:
      return {
        ...baseField,
        label: "Untitled Question",
        options: [{ id: "option_1", label: "Option 1", order: 0 }],
        allowMultiple: false,
      };

    case FIELD_TYPES.FILE_UPLOAD:
      return {
        ...baseField,
        label: "Untitled Question",
        acceptedTypes: ["*"],
        maxFileSize: 10485760, // 10MB
        maxFiles: 1,
      };

    case FIELD_TYPES.NUMBER:
      return {
        ...baseField,
        label: "Untitled Question",
        min: null,
        max: null,
        step: 1,
      };

    case FIELD_TYPES.UDF:
      return {
        ...baseField,
        label: "Designation",
        udfType: UDF_FIELD_TYPES.DESIGNATION,
        isSearchable: false,
      };

    default:
      return baseField;
  }
};

export const createSection = (overrides = {}) => ({
  id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: "Section 1 of 1",
  description: "",
  order: 0,
  ...overrides,
});

export const createFormSchema = (overrides = {}) => ({
  id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: "Course Feedback Form",
  description:
    "Help us improve! Share your feedback on your learning experience.",
  sections: [],
  fields: [],
  settings: {
    allowAnonymous: false,
    showProgressBar: true,
    submitButtonText: "Submit",
    successMessage: "Thank you for your feedback!",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const addFieldToSchema = (schema, field, position = null) => {
  const newFields = [...schema.fields];

  if (position !== null && position >= 0 && position <= newFields.length) {
    newFields.splice(position, 0, field);
  } else {
    newFields.push(field);
  }

  // Reorder fields
  newFields.forEach((f, index) => {
    f.order = index;
  });

  return {
    ...schema,
    fields: newFields,
    updatedAt: new Date().toISOString(),
  };
};

export const removeFieldFromSchema = (schema, fieldId) => {
  return {
    ...schema,
    fields: schema.fields.filter((f) => f.id !== fieldId),
    updatedAt: new Date().toISOString(),
  };
};

export const updateFieldInSchema = (schema, fieldId, updates) => {
  return {
    ...schema,
    fields: schema.fields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f,
    ),
    updatedAt: new Date().toISOString(),
  };
};

export const reorderFieldsInSchema = (schema, fromIndex, toIndex) => {
  const newFields = [...schema.fields];
  const [movedField] = newFields.splice(fromIndex, 1);
  newFields.splice(toIndex, 0, movedField);

  // Update order
  newFields.forEach((f, index) => {
    f.order = index;
  });

  return {
    ...schema,
    fields: newFields,
    updatedAt: new Date().toISOString(),
  };
};

export const addSectionToSchema = (schema, section, position = null) => {
  const newSections = [...schema.sections];

  if (position !== null && position >= 0 && position <= newSections.length) {
    newSections.splice(position, 0, section);
  } else {
    newSections.push(section);
  }

  // Reorder sections
  newSections.forEach((s, index) => {
    s.order = index;
  });

  return {
    ...schema,
    sections: newSections,
    updatedAt: new Date().toISOString(),
  };
};

export const validateField = (field, value) => {
  const errors = [];

  if (
    field.required &&
    (!value || (typeof value === "string" && value.trim() === ""))
  ) {
    errors.push("This field is required");
  }

  switch (field.type) {
    case FIELD_TYPES.SHORT_TEXT:
      if (value && value.length > field.maxLength) {
        errors.push(`Maximum ${field.maxLength} characters allowed`);
      }
      break;

    case FIELD_TYPES.LONG_TEXT:
      if (value && value.length > field.maxLength) {
        errors.push(`Maximum ${field.maxLength} characters allowed`);
      }
      break;

    case FIELD_TYPES.NUMBER:
      if (value !== null && value !== undefined && value !== "") {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push("Please enter a valid number");
        } else {
          if (field.min !== null && num < field.min) {
            errors.push(`Minimum value is ${field.min}`);
          }
          if (field.max !== null && num > field.max) {
            errors.push(`Maximum value is ${field.max}`);
          }
        }
      }
      break;

    case FIELD_TYPES.DROPDOWN:
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        errors.push("Please select an option");
      }
      break;

    case FIELD_TYPES.FILE_UPLOAD:
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        errors.push("Please upload a file");
      }
      break;

    case FIELD_TYPES.DATE_PICKER:
      if (field.required && !value) {
        errors.push("Please select a date");
      }
      break;
  }

  return errors;
};

export const validateForm = (schema, formData) => {
  const fieldErrors = {};
  let hasErrors = false;

  schema.fields.forEach((field) => {
    const value = formData[field.id];
    const errors = validateField(field, value);

    if (errors.length > 0) {
      fieldErrors[field.id] = errors;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    fieldErrors,
  };
};
