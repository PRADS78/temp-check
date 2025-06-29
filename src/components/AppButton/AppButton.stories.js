import {
  PrimaryButton as PB,
  OutlinedButton as OB,
  DropdownButton as DB,
  HyperlinkButton as HB,
  PlainButton as PlB,
  FloatingActionButton as FAB,
} from ".";
import { ButtonSize, ButtonTypes } from "../../Enums";

const storyConfig = {
  title: "Disprz/DisprzButtons",
  component: PB,
};

export default storyConfig;

const PrimaryButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <PB {...args} uniqueId={1665236201957} />
    </div>
  );
};

const OutlinedButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <OB {...args} uniqueId={1669208100967} />
    </div>
  );
};

const DropdownButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <DB {...args} uniqueId={1669208115230} />
    </div>
  );
};

const FloatingActionButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <FAB {...args} uniqueId={1669208115232} />
    </div>
  );
};

const HyperlinkButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <HB {...args} uniqueId={1669208124147} />
    </div>
  );
};

const PlainButtonTemplate = (args) => {
  return (
    <div
      id="button-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        width: "320px",
      }}
    >
      <PlB {...args} uniqueId={1669208132255} />
    </div>
  );
};

export const PrimaryButton = PrimaryButtonTemplate.bind({});
PrimaryButton.args = {
  label: "Ok",
  ctrCls: "primary-button",
  isDisabled: false,
  tooltipText: "primary",
};

export const OutlinedButton = OutlinedButtonTemplate.bind({});
OutlinedButton.args = {
  label: "Outlined",
  ctrCls: "outlined-button",
  isDisabled: false,
  tooltipText: "outlined",
};

export const DropdownButton = DropdownButtonTemplate.bind({});
DropdownButton.args = {
  iconCls: "icon-expand-more",
  label: "Show",
  isDisabled: false,
  tooltipText: "drop-down",
  type: ButtonTypes.DROP_DOWN,
  menuItems: [
    { label: "First", id: 1 },
    { label: "Second", id: 2 },
    { label: "Third with overflowing text", id: 3 },
  ],
};

export const FloatingActionButton = FloatingActionButtonTemplate.bind({});
FloatingActionButton.args = {
  label: "",
  ctrCls: "floating-action",
  iconOutlined: false,
  isDisabled: false,
  tooltipText: "floating-action",
};

export const HyperlinkButton = HyperlinkButtonTemplate.bind({});
HyperlinkButton.args = {
  label: "Hyperlink",
  isDisabled: false,
  onClick: () => {
    window.open("https://en.wikipedia.org/wiki/Hyperlink", "_blank");
  },
  tooltipText: "hyperlink",
};

export const PlainButton = PlainButtonTemplate.bind({});
PlainButton.args = {
  label: "Plain",
  isDisabled: false,
  tooltipText: "plain",
  type: "plain",
};

export const SmallSizedButton = PrimaryButtonTemplate.bind({});
SmallSizedButton.args = {
  label: "Small",
  ctrCls: "custom-class",
  isDisabled: false,
  tooltipText: "small",
  size: ButtonSize.SMALL,
};

export const EndToEndSizedButton = OutlinedButtonTemplate.bind({});
EndToEndSizedButton.args = {
  label: "End to End",
  ctrCls: "",
  isDisabled: false,
  tooltipText: "end to end",
  size: ButtonSize.END_TO_END,
};
