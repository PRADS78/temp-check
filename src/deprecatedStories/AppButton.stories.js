import AppButton from "../AppButton/AppButton";

export default {
  title: "Deprecated/AppButton",
  component: AppButton,
  name: "App Button",
  decorators: [(story) => story()],
  argTypes: {
    clickHandler: { action: "clicked" },
  },
};
const Template = (args) => <AppButton {...args} />;

export const Primary = Template.bind({});
export const Outlined = Template.bind({});
export const IconOnly = Template.bind({});

const parameters = {
  jest: {
    disable: true,
  },
};

Primary.args = {
  buttonLabel: "Primary Button",
  type: "primary",
};

Outlined.args = {
  buttonLabel: "Outlined Button",
  type: "outlined",
};

IconOnly.args = {
  buttonLabel: "",
  type: "primary",
  buttonIconCls: "icon-search",
};

IconOnly.args = {
  buttonLabel: "Plain Button",
  type: "plain",
  buttonIconCls: "icon-search",
};

Primary.parameters = Outlined.parameters = IconOnly.parameters = parameters;
