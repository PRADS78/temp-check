/**
 * 1. This file is used to export all the newly developed components via
 * Module Federation.
 * 2. Add only newer components to remote.js
 */
import "./Styles/Common.scss";

import "@disprz/icons/build/index.css";

export { default as AppIcon } from "./AppIcon/AppIcon";
export { default as UserSelectionWidget } from "./UserSelectionWidget/UserSelectionWidget";
export { default as UserSearchFilter } from "./UserSearchFilter/UserSearchFilter";
export {
  default as ThemeProvider,
  themeContext,
} from "./ThemeProvider/ThemeProvider";
export { default as LanguageHelper } from "./LanguageHelper";
export { DisprzLocalizer, LocalizerContext } from "./DisprzLocalizer";

export {
  PrimaryButton,
  OutlinedButton,
  DropdownButton,
  HyperlinkButton,
  PlainButton,
} from "./components/AppButton";
export { AlertDialog as DisprzAlert } from "./components/AlertDialog";
export { DropDown as DisprzDropDown } from "./components/DropDown";
export { TextField as DisprzTextField } from "./components/TextField";
export { TextArea as DisprzTextArea } from "./components/TextArea";
export { DialogBox as DisprzDialogBox } from "./components/DialogBox";
export { Checkbox as DisprzCheckbox } from "./components/Checkbox";
export { RadioButton as DisprzRadioButton } from "./components/RadioButton";
export { Switch as DisprzSwitch } from "./components/Switch";
export { DatePicker as DisprzDatePicker } from "./components/DatePicker";
export { TimePicker as DisprzTimePicker } from "./components/TimePicker";
export { SearchBar as DisprzSearchBar } from "./components/SearchBar";
export { Tabs as DisprzTabs } from "./components/Tabs";
export { Stepper as DisprzStepper } from "./components/Stepper";
export { Label as DisprzLabel } from "./components/Label";
export { Counter as DisprzCounter } from "./components/Counter";
export { Snackbar as DisprzSnackbar } from "./components/Snackbar";
export { UdfSelector as DisprzUdfSelector } from "./components/UdfSelector";
export { AlertDialog as DisprzAlertDialog } from "./components/AlertDialog";
export { Accordion as DisprzAccordion } from "./components/Accordion";
export { Table as DisprzTable } from "./components/Table";
export { ProgressBar as DisprzProgressBar } from "./components/ProgressBar";
export { InlineEdit as DisprzInlineEdit } from "./components/InlineEdit";
export { Badges as DisprzBadges } from "./components/Badges";
export { ToggleSwitch as DisprzToggleSwitch } from "./components/ToggleSwitch";
export { PortalDomProvider as DisprzPortalDomProvider } from "./components/PortalDomProvider";
export { FilterContainer as DisprzFilter } from "./components/Filter";
export { Slider as DisprzSlider } from "./components/Slider";
export { Banner as DisprzBanner } from "./components/Banner";
export { Tooltip as DisprzTooltip } from "./components/Tooltip";
export { Toggletip as DisprzToggletip } from "./components/Toggletip";
export { Charts as DisprzCharts } from "./components/Charts";
export { Chip as DisprzChip } from "./components/Chips";
export { CoachMark as DisprzCoachMark } from "./components/CoachMark";
export { Menu as DisprzSimpleMenu } from "./components/SimpleMenu";
export { ImageSelector as DisprzImageSelector } from "./components/ImageSelector";
export { Sort as DisprzSort } from "./components/Sort";
export { Tag as DisprzTag } from "../src/components/Tag";
export { Avatar as DisprzAvatar } from "../src/components/Avatar";

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
