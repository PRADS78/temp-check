// ToggleSelect.stories.js
import { useState } from "react";
import ToggleSelect from "../ToggleSelect/ToggleSelect";

export default {
  title: "Deprecated/ToggleSelect",
  component: ToggleSelect,
  name: "Toggle Button",
  argTypes: {
    onClick: { action: "clicked" },
  },
};

const Template = (args) => {
  return (
    <>
      <ToggleSelect {...args} />
    </>
  );
};

export const Basic = Template.bind({});
export const DefaultSelect = Template.bind({});

Basic.args = {
  ctrCls: "",
  items: [
    { name: "Toggle select 1", id: "id1" },
    { name: "Toggle select 2", id: "id2" },
  ],
  onClick: (e) => {
    console.log(e);
  }
};

DefaultSelect.args = {
  ...Basic.args,
  activeItems: { name: "Toggle select 2", id: "id2" }
}
