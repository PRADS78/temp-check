import ColumnTypes from "../ColumnTypes";

export class UserDefinedField {
  constructor(config = {}, canHideUdfsWithZeroUsers = false) {
    config = config || {};
    this.fieldId = config.fieldId || 0;
    this.fieldName = config.fieldName || "";
    this.fieldType = config.fieldType || UserDefinedField.FieldTypes.STRING;
    this.isMandatory = config.isMandatory === true;
    this.fieldValue = config.fieldValue || null;
    this.values = config.values || []; // this is array of strings

    this.allowedValues = config.allowedValues || []; // Array of { listItemId, listItemValue }
    this.dependent = false;
    this.canHideUdfsWithZeroUsers = canHideUdfsWithZeroUsers || false;
    this.init();
  }

  init() {
    let dependent = false;
    this.allowedValues.forEach(function (value) {
      // var fieldCondition = value.listItemCondition ? JSON.parse(value.listItemCondition) : null;
      var fieldCondition = null;
      if (value.listItemCondition) {
        try {
          fieldCondition = JSON.parse(value.listItemCondition);
        } catch (e) {
          console.warn(
            "Check the listItemCondition for listItemId " + value.listItemId
          );
        }
      }
      if (
        fieldCondition &&
        (fieldCondition.criteria || fieldCondition.description)
      ) {
        dependent = true;
      }
    });
    if (this.canHideUdfsWithZeroUsers) {
      this.setAllowedValues(
        this.allowedValues.filter((value) => value.isAssignedToUsers)
      );
    }
    this.dependent = dependent;
  }

  isNew() {
    return this.fieldId === 0;
  }

  isListType() {
    return (
      this.fieldType.toLowerCase() ===
      UserDefinedField.FieldTypes.LIST.toLowerCase()
    );
  }

  isStringType() {
    return (
      this.fieldType.toLowerCase() ===
      UserDefinedField.FieldTypes.STRING.toLowerCase()
    );
  }

  getListItemValueObjects() {
    var intValues = this.values.map((value) => {
      return parseInt(value);
    });

    var listItemValues = [];
    this.allowedValues.forEach((allowedValue) => {
      if (intValues.contains(allowedValue.listItemId)) {
        listItemValues.push(allowedValue);
      }
    });
    return listItemValues;
  }

  getAllowedValueObject(value) {
    value = value || this.fieldValue;
    var obj = this.allowedValues.find((allowedValue) => {
      return allowedValue.listItemId === parseInt(value);
    });
    return obj;
  }

  setAllowedValues(allowedValues) {
    this.allowedValues = allowedValues;
  }

  setFieldName(value) {
    this.fieldName = value;
  }

  getFieldName() {
    return this.fieldName;
  }

  getFieldType() {
    return this.fieldType;
  }

  setFieldType(value) {
    // Check value belongs to UserDefinedField.FieldTypes and assign. If not, default to String.
    var availableFieldTypes = Object.values(UserDefinedField.FieldTypes);
    var matchingFieldType =
      availableFieldTypes.find((fieldType) => {
        return fieldType === value;
      }) || UserDefinedField.FieldTypes.STRING;
    this.fieldType = matchingFieldType;
  }

  setMandatory(value) {
    this.isMandatory = value;
  }

  curateForCssClassname() {
    return this.fieldName
      .replaceAll('"', "")
      .replaceAll("'", "")
      .replaceAll(" ", "-")
      .toLowerCase();
  }
}
UserDefinedField.constructUserSearchWidgetConfig = (fieldNames) => {
  // First 2 fields are always userName and userFullName
  var userSearchConfig = [
    {
      key: "userName",
      name: "User ID",
      searchable: true,
      filterable: false,
      sortable: true,
      type: 2,
      cls: "col-xs-2 break-long-text",
    },
    {
      key: "userFullName",
      name: "User Name",
      searchable: true,
      filterable: false,
      sortable: true,
      type: 2,
      cls: "col-xs-3 break-long-text",
    },
  ];

  var getColumnKey = function (columnName) {
    var parts = columnName.split(" ");
    parts[0] = parts[0].toLowerCase();
    return parts.join("_");
  };

  var fieldCount = fieldNames.length,
    columnCls = "",
    fieldName;
  if (fieldCount <= 3) {
    switch (fieldCount) {
      case 1:
        columnCls = "col-xs-6 break-long-text";
        break;
      case 2:
        columnCls = "col-xs-3 break-long-text";
        break;
      case 3:
        columnCls = "col-xs-2 break-long-text ";
        break;
    }
    fieldNames.forEach(function (fieldName) {
      userSearchConfig.push({
        key: getColumnKey(fieldName),
        name: fieldName,
        searchable: false,
        filterable: true,
        sortable: true,
        type: ColumnTypes.STRING,
        cls: columnCls,
      });
    });
  } else {
    /// Break at 4 columns - 2 + 2 + 1 + 1
    for (var i = 0; i < 4; i++) {
      // eslint-disable-next-line no-redeclare
      var fieldName = fieldNames[i];
      userSearchConfig.push({
        key: getColumnKey(fieldName),
        name: fieldName,
        searchable: false,
        filterable: true,
        sortable: true,
        type: ColumnTypes.STRING,
        cls: i < 2 ? "col-xs-2 break-long-text" : "col-xs-1 break-long-text",
      });
    }
  }

  return userSearchConfig;
};
UserDefinedField.getFormattedFieldKey = (fieldName) => {
  if (fieldName.indexOf(" ") !== -1) {
    var splittedNames = fieldName.split(" ");
    splittedNames[0] = splittedNames[0].toLowerCase();
    return splittedNames.join("_");
  } else {
    return fieldName.toLowerCase();
  }
};
UserDefinedField.FieldTypes = {
  STRING: "String",
  LIST: "List",
};
