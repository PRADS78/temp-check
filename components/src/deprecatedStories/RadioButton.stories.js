// RadioButton.stories.js
import RadioButton from "../RadioButton/RadioButton";

export default {
  title: "Deprecated/RadioButton",
  component: RadioButton,
  name: "RadioButton",
  argTypes: {
    onRadioChange: { action: "changed" },
  },
};

const Template = (args) => <RadioButton {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  ctrCls: "",
  radioGroups: [
    { label: "Option 1", name: "option", id: "option1" },
    { label: "Option 2", name: "option", id: "option2" },
  ],
};

Basic.parameters = {
  jest: {
    disable: true,
  },
};
