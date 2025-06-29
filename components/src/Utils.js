export const extend = (copyTo, copyFrom) => {
  for (var prop in copyFrom) {
    copyTo[prop] = copyFrom[prop];
  }
  return copyTo;
};

export const areObjectsEqual = (nextProps, thisProps) => {
  return (
    thisProps.length === nextProps.length &&
    thisProps.every(function (value, index) {
      return value === nextProps[index];
    })
  );
};
Array.prototype.contains = function (value) {
  return this.indexOf(value) !== -1;
};
export const getQueryString = (params, userSelectedValues) => {
  params = extend({}, params);
  let udfString;
  let isUserSelectedFields = userSelectedValues.length > 0;
  if (isUserSelectedFields) {
    var udfSelectedDatas = [];
    userSelectedValues.forEach(function (data) {
      data["userName"] = data["userId"] ? data["userId"] : data["userName"];
      delete data["userId"];
      udfSelectedDatas.push(getJoinQueryString(data));
    }, this);
    udfString = udfSelectedDatas.join("&");
  }
  let queryString = getJoinQueryString(params);
  return isUserSelectedFields
    ? [queryString, udfString].join("&")
    : queryString;
};
export const getJoinQueryString = (params) => {
  return Object.keys(params)
    .reduce(function (r, k) {
      if (
        typeof params[k] !== "undefined" &&
        k != "fieldLabel" &&
        k != "fieldValues"
      ) {
        r.push(`${k}=${params[k]}`);
      }
      return r;
    }, [])
    .join("&");
};
export const getFilteredValues = (selections) => {
  let searchValues = [];
  Object.keys(selections).forEach((data) => {
    if (selections[data] && data !== "userFieldFilters") {
      var searchObj = {};
      searchObj[`${data}`] = encodeURIComponent(selections[data]);
      searchValues.push(searchObj);
    }
  }, this);
  let selectedValues = selections.userFieldFilters.map((selection) => {
    let fieldObject = {
      fieldId: selection.fieldId,
      fieldLabel: selection.fieldLabel,
      fieldValues: selection.fieldValues,
    };
    fieldObject.fieldValue = selection.listItemIds;

    if (selection.fieldType.toLowerCase() === "list") {
      fieldObject.fieldValue = selection.listItemIds;
    } else {
      fieldObject.fieldValue = selection.fieldValueSearchString;
    }
    return fieldObject;
  });
  return selectedValues.concat(searchValues);
};

export const getNeturalThemeColors = () => {
  var themeNeutralColors = {
    themeNeutral1: "#f8cf1c",
    themeNeutral2: "#ff900f",
    themeNeutral3: "#c92434",
    themeNeutral4: "#00b37d",
    themeNeutral5: "#000000",
    themeNeutral6: "#62717a",
    themeNeutral7: "#cbd0d3",
    themeNeutral8: "#efefef",
  }; // Theme Neutral colors as defined for themeing in _ThemeColorDefinition.scss
  return Object.assign([], themeNeutralColors) || {};
};

Array.prototype.findAndRemove = function (findFunction) {
  // First find the item to delete, using the findFunction
  var itemToDelete = this.find(findFunction),
    removedItem = null;

  // Remove using the our "remove" utility method
  if (itemToDelete) {
    this.remove(itemToDelete);
    removedItem = itemToDelete;
  }

  return removedItem;
};

export const hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const appendStyle = function (styles) {
  /* Create style document */
  var css = document.createElement("style");
  css.type = "text/css";

  if (css.styleSheet) css.styleSheet.cssText = styles;
  else css.appendChild(document.createTextNode(styles));

  /* Append style to the tag name */
  window.document.getElementsByTagName("head")[0].appendChild(css);
};

export const lightenDarkenColor = function (color, percentage) {
  var usePound = false;
  if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
  }
  var num = parseInt(color, 16);
  var r = (num >> 16) + percentage;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  var b = ((num >> 8) & 0x00ff) + percentage;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  var g = (num & 0x0000ff) + percentage;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

Array.prototype.remove = function (val) {
  var i = this.indexOf(val);
  return i > -1 ? this.splice(i, 1) : [];
};

export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const invariantSkipProd = (condition, message) => {
  if (process.env.NODE_ENV !== "production") {
    if (!condition) {
      let error = new Error(
        typeof message === "function" ? message() : message
      );
      error.name = "Disprz Component";
      throw error;
    }
  }
};

export const invariantUniqueId = (uniqueId, componentName) => {
  invariant(
    uniqueId && (typeof uniqueId === "number" || typeof uniqueId === "string"),
    `Passing uniqueId prop is mandatory for component - ${componentName}`
  );
};

export const invariantAutomationPrefixId = (
  automationIdPrefix,
  componentName
) => {
  invariant(
    automationIdPrefix && automationIdPrefix.trim(),
    ` ${componentName} component needs to wrapped by AutomationIdPrefixProvider `
  );
};

export const invariant = (condition, message) => {
  if (!condition) {
    let error = new Error(typeof message === "function" ? message() : message);
    error.name = "Disprz Component";
    throw error;
  }
};

/**
 * Modifying the time of a data to the end of the day
 */
export const patchTimeToEndOfDay = (date) => {
  const tempDate = structuredClone(date);
  if (tempDate instanceof Date) {
    tempDate.setHours(23, 59, 59, 999);
  }
  return tempDate;
};

export const createQuarterDateRange = (quarter, year) => {
  const fromDate = new Date(year, (quarter - 1) * 3, 1, 0, 0, 0, 0);
  const toDate = new Date();
  toDate.setHours(23, 59, 59, 999);

  return [fromDate, toDate];
};

export const isRTL = () => document.dir === "rtl";
