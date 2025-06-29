import { Counter } from ".";
import { useState } from "react";

const storyConfig = {
  title: "Disprz/DisprzCounter",
  component: Counter,
};

export default storyConfig;

function Template(args) {
  const containerStyle = {
    padding: "20px",
  };
  const [value, setValue] = useState(args.value);
  const onDecrease =
    args.onDecrease ??
    function (val) {
      setValue(val);
    };
  const onIncrease =
    args.onIncrease ??
    function (val) {
      setValue(val);
    };
  const onChange =
    args.onChange ??
    function (event, value) {
      let inputValue = value;
      console.log("onChange", inputValue);
    };
  const onInvalidInput =
    args.onInvalidInput ??
    function (event, value, limit) {
      console.log("onLimitExceeded", value, limit);
    };

  return (
    <div data-testid="counter-container" style={containerStyle}>
      <Counter
        {...args}
        value={value}
        uniqueId={1666072489128}
        onChange={onChange}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        onInvalidInput={onInvalidInput}
      />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  value: 0,
  min: 0,
  max: 100,
};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  value: 0,
};

export const WithError = Template.bind({});
WithError.args = {
  value: 0,
  min: 2,
  max: 10,
};

export const DisableInput = Template.bind({});
DisableInput.args = {
  value: 0,
  shouldEnableValueChangeByInput: false,
};
