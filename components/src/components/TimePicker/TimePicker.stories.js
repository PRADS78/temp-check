import { TimePicker } from ".";
import { useState } from "react";

const storyConfig = {
  title: "Disprz/DisprzTimePicker",
  component: TimePicker,
};

export default storyConfig;

function Template(args) {
  const [time, setTime] = useState(
    args.time ? args.time : args.isHour24Mode ? "15:00" : "3:00 pm"
  );
  const templateStyle = {
    boxSizing: "border-box",
    height: "470px",
    padding: "15px",
  };

  const onOkay =
    args.onOkay ??
    function (updatedTime) {
      setTime(updatedTime);
    };
  const onCancel =
    args.onCancel ??
    function () {
      console.log("cancel time selection");
    };

  return (
    <div style={templateStyle} data-testid="time-picker-container">
      <TimePicker
        {...args}
        time={time}
        onCancel={onCancel}
        onOkay={onOkay}
        uniqueId={1667215930779}
      />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  label: "From",
};

// export const TwentyFour = Template.bind({});
// TwentyFour.args = {
//   isHour24Mode: true,
// };

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: "",
};

const parameters = {
  jest: ["TimePicker.test.js"],
};

Standard.parameters = WithoutLabel.parameters = parameters;
