import { ReactComponent as AppIcon } from "../../../stories/assets/AppIcons.svg";
import { ButtonTypes } from "../../../Enums";
import { SearchIcon } from "../../../Icons";
import AppButton from "./AppButton";

const storyConfig = {
  title: "Disprz/DisprzButtons/Deprecated",
  component: AppButton,
};

export default storyConfig;

const Template = (args) => {
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
      <AppButton {...args} uniqueId={1669208838117} />
    </div>
  );
};

const IconDecorator = [
  (Story) => (
    <div>
      <AppIcon />
      <Story />
    </div>
  ),
];

const parameters = {
  jest: ["AppButton.test.js"],
};

export const Primary = Template.bind({});
Primary.args = {
  label: "Ok",
  ctrCls: "primary-button",
  isDisabled: false,
  tooltipText: "primary",
};

export const Outlined = Template.bind({});
Outlined.args = {
  label: "Outlined",
  ctrCls: "outlined-button",
  isDisabled: false,
  tooltipText: "outlined",
  type: "outlined",
};

export const Plain = Template.bind({});
Plain.args = {
  label: "Plain",
  isDisabled: false,
  tooltipText: "plain",
  type: "plain",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Plain",
  isDisabled: true,
  type: ButtonTypes.PRIMARY,
};

// export const FloatingAction = Template.bind({});
// FloatingAction.args = {
//   label: "",
//   ctrCls: "floating-action",
//   isDisabled: false,
//   type: "floating-action",
//   iconCls: "icon-add",
// };
// FloatingAction.decorators = IconDecorator;

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: "Search",
  icon: () => {
    return <SearchIcon canRenderOnlyIcon className="search stroke" />;
  },
  type: "outlined",
};
WithIcon.decorators = IconDecorator;

export const DropDown = Template.bind({});
DropDown.args = {
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
DropDown.decorators = IconDecorator;

export const SmallButton = Template.bind({});
SmallButton.args = {
  label: "Small",
  ctrCls: "custom-class",
  isDisabled: false,
  tooltipText: "small",
  size: "small",
};

export const EndToEnd = Template.bind({});
EndToEnd.args = {
  label: "End to End",
  ctrCls: "",
  isDisabled: false,
  tooltipText: "end to end",
  size: "end-to-end",
};

export const Hyperlink = Template.bind({});
Hyperlink.args = {
  label: "Hyperlink",
  isDisabled: false,
  onClick: () => {
    window.open("https://en.wikipedia.org/wiki/Hyperlink", "_blank");
  },
  tooltipText: "hyperlink",
  type: ButtonTypes.HYPERLINK,
};

Primary.parameters =
  Outlined.parameters =
  Plain.parameters =
  Disabled.parameters =
  DropDown.parameters =
  SmallButton.parameters =
  WithIcon.parameters =
  EndToEnd.parameters =
    parameters;
