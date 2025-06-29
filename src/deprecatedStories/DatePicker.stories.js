// DatePicker.stories.js
import DateTimePicker from "../DatePicker/DateTimePicker";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/DateTimePicker",
  component: DateTimePicker,
  name: "DateTimePicker",
  argTypes: {
    onChange: { action: "changed" },
  },
  decorators: [
    (story) => {
      return (
        <div>
          <AppIcon />
          {story()}
        </div>
      );
    },
  ],
};

const Template = (args) => <DateTimePicker {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  ctrCls: "",
  name: "date",
  label: "Date Picker",
  dateFormat: "dd/MM/yyyy",
  selected: null,
  selectRange: false,
  startDate: null,
  endDate: null,
  disabled: false,
  placeholder: "Select Date",
};

Basic.parameters = {
  jest: {
    disable: true,
  },
};
