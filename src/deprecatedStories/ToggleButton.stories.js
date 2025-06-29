// ToggleButton.stories.js
import { useState } from "react";
import ToggleButton from "../ToggleButton/ToggleButton";

export default {
  title: "Deprecated/ToggleButton",
  component: ToggleButton,
  name: "Toggle Button",
  argTypes: {
    onChange: { action: "changed" },
  },
};

const Template = (args) => {
  const [checked, setChecked] = useState(args.checked ?? false);
  return (
    <>
      <ToggleButton
        {...args}
        checked={checked}
        onChange={(...params) => {
          args.onChange(...params);
          setChecked(params[0].target.checked);
        }}
      />
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  ctrCls: "",
  disabled: false,
  checked: false,
  name: "toogle",
};
