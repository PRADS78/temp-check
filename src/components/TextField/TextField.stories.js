import { TextField } from ".";
import { TextFieldTypes } from "../../Enums";
import { useState } from "react";

const storyConfig = {
  title: "Disprz/DisprzTextField",
  component: TextField,
};

export default storyConfig;

const Template = (args) => {
  const [value, setValue] = useState(args.value);
  const containerStyle = {
    backgroundColor: "#EEEEEE",
    height: "100px",
    padding: "10px",
    width: "320px",
    display: "flex",
    alignItems: "center",
  };

  const onChange = (_, text) => {
    setValue(text);
    typeof args?.onChange === "function" && args.onChange(_, text);
  };
  const _onChange = onChange;
  const _onInvalidNumberInput =
    args.onInvalidNumberInput ??
    // eslint-disable-next-line no-unused-vars
    ((_, value, limit) => {
      // console.log("invalid number: ", value, limit);
    });
  return (
    <div style={containerStyle} data-testid="text-field-container">
      <TextField
        {...args}
        onChange={_onChange}
        value={value}
        uniqueId={1669187933567}
        onInvalidNumberInput={_onInvalidNumberInput}
      />
    </div>
  );
};

export const Standard = Template.bind({});
Standard.args = {
  borderGapColor: "#eeeeee",
};

export const Number = Template.bind({});
Number.args = {
  borderGapColor: "#eeeeee",
  type: TextFieldTypes.NUMBER,
  max: 100,
  min: 0,
};

export const DecimalNumber = Template.bind({});
DecimalNumber.args = {
  borderGapColor: "#eeeeee",
  type: TextFieldTypes.DECIMAL_NUMBER,
  max: 100,
  min: 0,
};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  borderGapColor: "#eeeeee",
};

export const HelpText = Template.bind({});
HelpText.args = {
  borderGapColor: "#eeeeee",
  helpText: "Enter name",
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  borderGapColor: "transparent",
  title: "Flavor",
};

export const Password = Template.bind({});
Password.args = {
  borderGapColor: "#eeeeee",
  type: "password",
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  borderGapColor: "#eeeeee",
  errorMessage: "Error message",
};

// export const Keyword = Template.bind({});
// Keyword.args = {
//   type: TextFieldTypes.KEYWORD,
//   placeholder: "Create keyword",
//   onChange: (_, value) => console.log("the keyword value is: ", value),
// };

const parameters = {
  jest: ["TextField.test.js"],
};

Standard.parameters =
  Number.parameters =
  Disabled.parameters =
  HelpText.parameters =
  WithTitle.parameters =
  Password.parameters =
    parameters;
