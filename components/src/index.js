/**
 * 1. Currently all exports are duplicated in remote.js also.
 * 2. This is done to avoid dependency on remote.js (Module Federation)
 * 3. Add only newer components to remote.js
 */

import "./Styles/Common.scss";

import "@disprz/icons/build/index.css";

export { default as AppIcon } from "../src/AppIcon/AppIcon";
export { default as UserSelectionWidget } from "./UserSelectionWidget/UserSelectionWidget";
export { default as UserSearchFilter } from "./UserSearchFilter/UserSearchFilter";
export { default as LocalFileSelector } from "./LocalFileSelector/LocalFileSelector";
export { default as ReportWidget } from "./ReportWidget/ReportWidget";
export { default as SchedulingWidget } from "./SchedulingWidget/SchedulingWidget";
export {
  default as ThemeProvider,
  themeContext,
} from "./ThemeProvider/ThemeProvider";
export { default as SearchWidget } from "./SearchWidget/SearchWidget";
export { default as LanguageHelper } from "./LanguageHelper";
export {
  DisprzLocalizer,
  LocalizerContext,
  useLocalizerContext,
} from "./DisprzLocalizer";

export {
  PrimaryButton,
  OutlinedButton,
  DropdownButton,
  HyperlinkButton,
  PlainButton,
  FloatingActionButton,
} from "../src/components/AppButton";
export { AlertDialog as DisprzAlert } from "../src/components/AlertDialog";
export { DropDown as DisprzDropDown } from "../src/components/DropDown";
export { TextField as DisprzTextField } from "../src/components/TextField";
export { TextArea as DisprzTextArea } from "../src/components/TextArea";
export { DialogBox as DisprzDialogBox } from "../src/components/DialogBox";
export { Checkbox as DisprzCheckbox } from "../src/components/Checkbox";
export { RadioButton as DisprzRadioButton } from "../src/components/RadioButton";
export { Switch as DisprzSwitch } from "../src/components/Switch";
export { DatePicker as DisprzDatePicker } from "../src/components/DatePicker";
export { TimePicker as DisprzTimePicker } from "../src/components/TimePicker";
export { SearchBar as DisprzSearchBar } from "../src/components/SearchBar";
export { Tabs as DisprzTabs } from "../src/components/Tabs";
export { Stepper as DisprzStepper } from "../src/components/Stepper";
export { Label as DisprzLabel } from "../src/components/Label";
export { Counter as DisprzCounter } from "../src/components/Counter";
export { Snackbar as DisprzSnackbar } from "../src/components/Snackbar";
export { UdfSelector as DisprzUdfSelector } from "../src/components/UdfSelector";
export { AlertDialog as DisprzAlertDialog } from "../src/components/AlertDialog";
export { Accordion as DisprzAccordion } from "../src/components/Accordion";
export { Table as DisprzTable } from "../src/components/Table";
export { ProgressBar as DisprzProgressBar } from "../src/components/ProgressBar";
export { InlineEdit as DisprzInlineEdit } from "../src/components/InlineEdit";
export { Badges as DisprzBadges } from "../src/components/Badges";
export { ToggleSwitch as DisprzToggleSwitch } from "../src/components/ToggleSwitch";
export { PortalDomProvider as DisprzPortalDomProvider } from "../src/components/PortalDomProvider";
export { FilterContainer as DisprzFilter } from "../src/components/Filter";
export { Slider as DisprzSlider } from "../src/components/Slider";
export { Banner as DisprzBanner } from "../src/components/Banner";
export { Tooltip as DisprzTooltip } from "../src/components/Tooltip";
export { Toggletip as DisprzToggletip } from "../src/components/Toggletip";
export { Charts as DisprzCharts } from "../src/components/Charts";
export { Chip as DisprzChip } from "../src/components/Chips";
export { CoachMark as DisprzCoachMark } from "../src/components/CoachMark";
export { Menu as DisprzSimpleMenu } from "../src/components/SimpleMenu";
export { ImageSelector as DisprzImageSelector } from "../src/components/ImageSelector";
export { Sort as DisprzSort } from "../src/components/Sort";
export { Tag as DisprzTag } from "../src/components/Tag";
export { Avatar as DisprzAvatar } from "../src/components/Avatar";
export {
  FileUpload as DisprzFileUpload,
  DropZone,
  UploadProgressItem,
} from "../src/components/FileUpload";

export { AutomationIdPrefixProvider } from "./AutomationIdPrefix";

export {
  AlertDialogTypes,
  ButtonTypes,
  SortOrder,
  StepperStepState as StepperState,
  StepperStepType as StepperType,
  ProgressBarSize,
  InlineEditViewState,
  ToggleSwitchSize,
  TableFilterListSubTypes,
  TableFilterTypes,
  SliderTypes,
  BannerTypes,
  ToolTipPositions,
  ToolTipTypes,
  ArrowPointType,
  TableExpansionType,
  ToggleTipPositions,
  SnackBarTypes,
  TableLoadingOptions,
  SnackBarDuration,
  PopperReferenceStrategies,
  TagColor,
} from "./Enums";

import packageJson from "../package.json";
const version = packageJson.version;

export { version };

/**
 * Deprecated components
 */
export { default as AppButton } from "../src/AppButton/AppButton";
export { default as DialogControl } from "./DialogControl/DialogControl";
export { default as DropDown } from "./DropDown/DropDown";
export { default as Toast } from "./Toast/Toast";
export { default as MultiSelectDropDown } from "./MultiSelectDropDown/MultiSelectDropDown";
export { default as Checkbox } from "./Checkbox/Checkbox";
export { default as DateTimePicker } from "./DatePicker/DateTimePicker";
export { default as TimePicker } from "./TimePicker/TimePicker";
export { default as RadioButton } from "./RadioButton/RadioButton";
export { default as ToggleButton } from "./ToggleButton/ToggleButton";
export { default as InputTextField } from "./InputTextField/InputTextField";
export { default as ProgressDisplayElement } from "./ProgressDisplayElement/ProgressDisplayElement";
export { default as ToggleSelect } from "./ToggleSelect/ToggleSelect";
export { default as UdfSelector } from "./UdfSelector/UdfSelector";
export { default as HelperProvider, helperContext } from "./Helpers/Helpers";

export { AppButton as DisprzButton } from "../src/components/AppButton";
