// UdfSelector.stories.js
import { useState } from "react";
import UdfSelector from "../UdfSelector/UdfSelector";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/UdfSelector",
  component: UdfSelector,
  name: "UdfSelector",
  decorators: [(story) => story()],
  argTypes: {
    onSelect: { action: "changed" },
  },
};

const Template = (args) => {
  const [values, setValues] = useState(
    args.selectedUdfValues ? args.selectedUdfValues : []
  );
  return (
    <>
      <AppIcon />
      <UdfSelector
        {...args}
        onUdfValueSelect={(e) => {
          args.onSelect(...e);
          setValues(e);
        }}
        selectedUdfValues={values}
      />
    </>
  );
};

export const Basic = Template.bind({});

export const DefaultSelected = Template.bind({});

Basic.args = {
  udfCtrCls: "ctrl_class",
  udfValueCtrCls: "ctrl_value_class",
  udfPlaceholder: "Select value",
  udfValuePlaceholder: "Select value 2",
  udfFetchAPiUrl:
    "https://disprzpipeline.disprz.com/demoservice/api/service/getFilteredData",
  deleteAlertContent: "",
};

DefaultSelected.args = {
  ...Basic.args,
  selectedUdfValues: [
    {
      udfFieldId: 1231,
      udfFieldLabel: "Office Location",
      udfFieldValues: ["Chennai", "Bangalore, Karnataka"],
    },
    {
      udfFieldId: 1232,
      udfFieldLabel: "Department",
      udfFieldValues: ["QA", "Dev", "Pune"],
    },
  ],
};
