import { useState } from "react";
import { ToggleSwitchSize } from "../../Enums";
import ToggleSwitch from "./ToggleSwitch";

export default {
  title: "Disprz/DisprzToggleSwitch",
  component: ToggleSwitch,
};

const Template = (args) => {
  const [selectedId, setSelectedId] = useState(args.selectedId);
  const onChange =
    args.onChange ??
    function (e, item) {
      setSelectedId(item.id);
    };
  return (
    <ToggleSwitch
      {...args}
      onChange={onChange}
      selectedId={selectedId}
      uniqueId={1670249199027}
    />
  );
};

export const Standard = Template.bind({});
Standard.args = {
  items: [
    {
      label: "Option 1",
      id: 1,
    },
    {
      label: "Long Option Here",
      id: 2,
    },
  ],
  selectedId: 1,
};

export const Small = Template.bind({});
Small.args = {
  ...Standard.args,
  size: ToggleSwitchSize.SMALL,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Standard.args,
  isDisabled: true,
};
