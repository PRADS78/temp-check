const AlertDialogTypes = {
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning",
};

const ButtonTypes = {
  PRIMARY: "primary",
  OUTLINED: "outlined",
  ICON_CONTAINED: "icon-contained",
  ICON_ONLY: "icon-only",
  PLAIN: "plain",
  FLOATING_ACTION: "floating-action",
  DROP_DOWN: "drop-down",
  HYPERLINK: "hyperlink",
};

const DatePickerTypes = {
  STANDARD: "standard",
  MULTI_SELECT: "multi-select",
  RANGE: "range",
};

const DefaultDateRanges = {
  THIS_WEEK: "this-week",
  LAST_15: "last-15",
  LAST_30: "last-30",
  LAST_3_MONTHS: "last-3-months",
};

const DropDownOptionTypes = {
  STANDARD: "standard",
  GROUPED: "grouped",
};

const DropDownMenuPlacement = {
  AUTO: "auto",
  BOTTOM: "bottom",
  TOP: "top",
};

const DropDownPosition = {
  BOTTOM: "bottom",
  TOP: "top",
};

const InputBoxtypes = {
  TEXT: "text",
  PASSWORD: "password",
  EMAIL: "email",
  NUMBER: "number",
};

const HelperPositionTypes = {
  TOP: "TOP",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  CENTER: "CENTER",
  AUTO: "AUTO",
};

const RadioButtonOrientation = {
  horizontal: "horizontal",
  vertical: "vertical",
};

const Size = {
  SMALL: "small",
  LARGE: "large",
  STANDARD: "standard",
};

const SortOrder = {
  ASCENDING: "asc",
  DESCENDING: "desc",
};

const StepperStepState = {
  DONE: "done",
  UNLOCKED: "unlocked",
  LOCKED: "locked",
};

const StepperStepType = {
  LINEAR: "LINEAR",
  NON_LINEAR: "NON_LINEAR",
  PARTIAL_LINEAR: "PARTIAL_LINEAR",
};

const TextFieldTypes = {
  TEXT: "text",
  PASSWORD: "password",
  EMAIL: "email",
  NUMBER: "number",
  DECIMAL_NUMBER: "decimal_number",
  KEYWORD: "keyword",
};

const SnackBarTypes = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

const UdfActions = {
  UDF_ADD: "UDF_ADD",
  UDF_REMOVE: "UDF_REMOVE",
};

const TableColumns = {
  SELECTION: "~~selection~~",
  EXPANSION: "~~expansion~~",
};

const TableSelectOptions = {
  SELECT_CURRENT_PAGE: 1,
  SELECT_ALL_PAGES: 2,
  DESELECT_ALL: 3,
};

const TableLoadingOptions = {
  LOADING: "Loading",
  LOADED: "Loaded",
  EMPTY: "Empty",
  ERROR: "Error",
};

const ChipColor = {
  PRIMARY: "primary",
  DEFAULT: "default",
};

const createInlineEditViewState = () => {
  const inlineEditViewState = {
    DISPLAY_VIEW: 1,
    EDIT_VIEW: 2,
  };
  const keyMap = {
    DisplayView: "DISPLAY_VIEW",
    EditView: "EDIT_VIEW",
  };
  const proxiedObject = new Proxy(inlineEditViewState, {
    get: function (target, prop) {
      if (Object.keys(inlineEditViewState).includes(prop)) {
        return inlineEditViewState[prop];
      }
      const keyName = keyMap[prop];
      console.warn(
        `InlineEditViewState: use inlineEditViewState.${keyName} instead of inlineEditViewState.${prop} `
      );
      return target[keyName];
    },
  });
  return proxiedObject;
};
const InlineEditViewState = createInlineEditViewState();
const ButtonSize = {
  SMALL: "small",
  REGULAR: "regular",
  END_TO_END: "endToEnd",
};

const ProgressBarSize = {
  SMALL: "small",
  BIG: "big",
};

const ToggleSwitchSize = {
  SMALL: "small",
  REGULAR: "regular",
};

const SliderTypes = {
  CONTINUOUS: "continuous_slider",
  DISCRETE: "discrete_slider",
};

const TableFilterTypes = {
  LIST: "list",
  DATE: "date",
  NUMBER: "number",
};

const TableFilterListSubTypes = {
  ON_DEMAND: "onDemand",
  PAGINATED: "paginated",
  FULLY_CUSTOMISABLE: "fullyCustomisable",
};

const ChipSelectionType = {
  SINGLE: "single",
  MULTI: "multi",
};

const TagColor = {
  SUCCESS: "success",
  WARNING: "warning",
  DEFAULT: "default",
  DANGER: "danger",
  SURVEY: "survey",
  SELF_PACED_MODULE: "selfPacedModule",
  CLASSROOM_MODULE: "classroomModule",
  MOOC_MODULE: "moocModule",
  LIVE_MODULE: "liveModule",
  ARTEFACT: "artefact",
  EVALUATIONS: "evaluations",
  PERSONALIZED_JOURNEY: "personalizedJourney",
  STANDARD_JOURNEY: "standardJourney",
  MODULE: "module",
  PRIMARY: "primary",
};

const BannerTypes = {
  INFO: "info",
  END_TO_END: "endToEnd",
};

const BannerEndToEndTypes = {
  DEFAULT: "default",
  ALERT: "alert",
};

const FilterListSelectionType = {
  NON_FILTERING: "nonFiltering",
  FILTERING: "filtering",
};

const FileFormats = {
  PNG: ".png",
  JPG: ".jpg",
  JPEG: ".jpeg",
  GIF: ".gif",
  WEBP: ".webp",
  MP4: ".mp4",
  WEBM: ".webm",
  MOV: ".mov",
  MP3: ".mp3",
  AAC: ".aac",
};

const FileTypes = {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  DOCUMENT: "DOCUMENT",
};

const FileUploadErrorMessage = {
  INVALID_FORMAT: "Invalid Format",
  FILE_SIZE_EXCEED: "File size Exceed",
  MAX_FILE_LIMIT_EXCEED: "Max file limit Exceed",
  FILE_UPLOAD_ERROR: "Something went wrong",
};

const PopperPlacements = {
  TOP: "top",
  TOP_START: "top-start",
  TOP_END: "top-end",
  BOTTOM: "bottom",
  BOTTOM_START: "bottom-start",
  BOTTOM_END: "bottom-end",
  LEFT: "left",
  LEFT_START: "left-start",
  LEFT_END: "left-end",
  RIGHT: "right",
  RIGHT_START: "right-start",
  RIGHT_END: "right-end",
  AUTO: "auto",
};

const ToolTipPositions = PopperPlacements;

const ToggleTipPositions = PopperPlacements;

const SimpleMenuPositions = PopperPlacements;

const ToolTipTypes = {
  DEFAULT: "default",
  PROGRESS: "progress",
};

const ArrowPointType = {
  SMOOTH: "smooth",
  SHARP: "sharp",
};

const TableExpansionType = {
  NON_COHESIVE: "noncohesive",
  COHESIVE: "cohesive",
};

const CropReturnType = {
  BASE64: "base64",
  BLOB: "blob",
};

const ImageProviderName = {
  UNSPLASH: "UNSPLASH",
  PEXELS: "PEXELS",
};

const SnackBarDuration = {
  SHORT: 1750,
  LONG: 2750,
  INDEFINITE: -1,
};

const KeyCode = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: "Space",
  TAB: "Tab",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  HOME: "Home",
  END: "End",
  MOUSE_ENTER: "onMouseEnter",
  MOUSE_LEAVE: "onMouseLeave",
  BACKSPACE: "Backspace",
};

const InteractionType = {
  KEYBOARD: "keyboard",
  MOUSE: "mouse",
};

const FilterLocalizedBannerDuration = {
  FILTER_LIMIT: 4000,
  OPTION_LIMIT: 4000,
};

const PopperReferenceStrategies = {
  ABSOLUTE: "absolute",
  FIXED: "fixed",
};

const NameSpace = {
  DEFAULT: "default",
  DCMP: "dcmp",
};

export {
  AlertDialogTypes,
  ButtonTypes,
  DefaultDateRanges,
  DropDownMenuPlacement,
  DropDownPosition,
  DatePickerTypes,
  DropDownOptionTypes,
  InputBoxtypes,
  HelperPositionTypes,
  RadioButtonOrientation,
  Size,
  SortOrder,
  StepperStepState,
  TextFieldTypes,
  SnackBarTypes,
  UdfActions,
  TableColumns,
  TableSelectOptions,
  ChipColor,
  StepperStepType,
  InlineEditViewState,
  ButtonSize,
  ProgressBarSize,
  ToggleSwitchSize,
  SliderTypes,
  TableFilterTypes,
  ChipSelectionType,
  TagColor,
  BannerTypes,
  BannerEndToEndTypes,
  FilterListSelectionType,
  TableFilterListSubTypes,
  FileFormats,
  FileUploadErrorMessage,
  FileTypes,
  PopperPlacements,
  ToolTipPositions,
  ToolTipTypes,
  ArrowPointType,
  TableExpansionType,
  ToggleTipPositions,
  SimpleMenuPositions,
  TableLoadingOptions,
  CropReturnType,
  ImageProviderName,
  SnackBarDuration,
  KeyCode,
  InteractionType,
  FilterLocalizedBannerDuration,
  PopperReferenceStrategies,
  NameSpace,
};
