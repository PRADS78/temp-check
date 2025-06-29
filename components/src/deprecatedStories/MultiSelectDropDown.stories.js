// MultiSelectDropDown.stories.js
import { useState } from "react";
import MultiSelectDropDown from "../MultiSelectDropDown/MultiSelectDropDown";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/MultiSelectDropDown",
  component: MultiSelectDropDown,
  name: "MultiSelectDropDown",
  decorators: [(story) => story()],
  argTypes: {
    onSelect: { action: "changed" },
  },
};

const Template = (args) => {
  const [values, setValues] = useState(args.values.length ? args.values : []);
  return (
    <>
      <AppIcon />
      <MultiSelectDropDown
        {...args}
        onSelect={(e) => {
          args.onSelect(...e);
          setValues(e);
        }}
        values={values}
      />
    </>
  );
};

export const Basic = Template.bind({});
export const DefaultSelected = Template.bind({});
let defaultSelected = [
  { label: "Value 2", value: "val2" },
  { label: "Value 4", value: "val4" },
];
Basic.args = {
  ctrCls: "",
  placeholder: "Select value",
  items: [
    { label: "Value 1", value: "val1" },
    { label: "Value 2", value: "val2" },
    { label: "Value 3", value: "val3" },
    { label: "Value 4", value: "val4" },
    { label: "Value 5", value: "val5" },
  ],
  values: [],
};

DefaultSelected.args = {
  ctrCls: "",
  placeholder: "Select value",
  items: [
    { label: "Value 1", value: "val1" },
    { label: "Value 2", value: "val2" },
    { label: "Value 3", value: "val3" },
    { label: "Value 4", value: "val4" },
    { label: "Value 5", value: "val5" },
  ],
  values: defaultSelected,
};
