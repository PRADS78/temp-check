// DropDown.stories.js
import { useState } from "react";
import DropDown from "../DropDown/DropDown";

export default {
  title: "Deprecated/DropDown",
  component: DropDown,
  argTypes: {
    onSelect: { action: "changed" },
  },
};
const Template = (args) => {
  const [value, setValue] = useState(args.value ?? "");

  return (
    <>
      <DropDown
        {...args}
        onSelect={(params) => {
          args.onSelect(params);
          setValue(params);
        }}
        value={value}
      />
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  placeholder: "Select...",
  name: "dropdown",
  items: [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ],
  ctrCls: "",
  isClearable: false,
  searchable: false,
  isMulti: false,
  value: null,
  isDisabled: false,
  isLoading: false,
};

Basic.parameters = {
  jest: { disable: true },
};
