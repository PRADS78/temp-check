// InputTextField.stories.js
import { useState } from "react";
import InputTextField from "../InputTextField/InputTextField";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/InputTextField",
  component: InputTextField,
  name: "Input Box",
  decorators: [(story) => story()],
  argTypes: {
    onChange: { action: "changed" },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value ?? "");

  return (
    <>
      <AppIcon />
      <InputTextField
        {...args}
        onChange={(...params) => {
          args.onChange(...params);
          setValue(params[0].target.value);
        }}
        value={value}
        type={args.type}
      />
    </>
  );
};

export const Basic = Template.bind({});
export const Password = Template.bind({});

Basic.args = {
  ctrCls: "",
  type: "text",
  name: "textbox",
  label: "Label",
  disabled: false,
  helpText: "",
  value: "",
  required: true,
  errorMessage: "",
};

Password.args = {
  ...Basic.args,
  type: "password",
};
