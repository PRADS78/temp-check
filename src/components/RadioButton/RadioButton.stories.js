import { RadioButton } from ".";
import { RadioButtonOrientation } from "../../Enums";
import { useState } from "react";

const storyConfig = {
  title: "Disprz/DisprzRadioButton",
  component: RadioButton,
  parameters: {
    docs: {
      source: {
        type: "code",
      },
    },
  },
};

export default storyConfig;

function Template(args) {
  const [selectedGroupId, setSelectedGroupId] = useState(args.selectedGroupId);

  const _onChange =
    args.onChange ??
    function (event) {
      setSelectedGroupId(event.target.value);
    };

  return (
    <div data-testid="radio-button-container" style={{ padding: "20px" }}>
      <RadioButton
        {...args}
        groups={args.groups}
        uniqueId={1666949089581}
        selectedGroupId={selectedGroupId}
        onChange={_onChange}
      />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  groups: [
    { label: "Mango", name: "flavor", id: "mango" },
    { label: "Strawberry", name: "flavor", id: "strawberry", isDisabled: true },
    { label: "Vanilla", name: "flavor", id: "vanilla" },
  ],
  selectedGroupId: "vanilla",
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  groups: [
    { label: "Mango", name: "flavor", id: "mango" },
    { label: "Strawberry", name: "flavor", id: "strawberry" },
    { label: "Vanilla", name: "flavor", id: "vanilla" },
  ],
  orientation: RadioButtonOrientation.horizontal,
  selectedGroupId: "vanilla",
};

const parameters = {
  jest: ["RadioButton.test.js"],
};

Standard.parameters = Horizontal.parameters = parameters;
