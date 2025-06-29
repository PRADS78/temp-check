// Checkbox.stories.js
import Checkbox from "../Checkbox/Checkbox";

export default {
  title: "Deprecated/Checkbox",
  component: Checkbox,
  name: "Checkbox",
  decorators: [(story) => story()],
  argTypes: {
    onChange: { action: "checked" },
    id: "checkbox",
  },
};

const Template = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  label: "Checkbox",
  ctrCls: "",
  name: "checkbox",
};

Basic.parameters = {
  jest: {
    disable: true,
  },
};
