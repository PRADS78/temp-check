import TimePicker from "../TimePicker/TimePicker";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/TimePicker",
  component: TimePicker,
  argTypes: {
    selectTime: { action: "clicked" },
  },
  decorators: [
    (story) => (
      <>
        <AppIcon />
        {story()}
      </>
    ),
  ],
};

const Template = (args) => <TimePicker {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  ctrCls: "",
  label: "Time Picker",
  name: "time",
  hour24Mode: false,
  openDefault: false,
  time: "12:00",
  disabled: false,
};
