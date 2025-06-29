import { Checkbox } from ".";
import { useArgs } from "@storybook/client-api";

const storyConfig = {
  title: "Disprz/DisprzCheckbox",
  component: Checkbox,
};

export default storyConfig;

function Template(args) {
  const [{ isChecked }, updateArgs] = useArgs();
  return (
    <div
      data-testid="checkbox-container"
      style={{ padding: "15px" }}
      onChange={() => updateArgs({ isChecked: !isChecked })}
    >
      <Checkbox {...args} uniqueId={1666069714074} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  isChecked: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  isChecked: false,
};

const parameters = {
  jest: ["Checkbox.test.js"],
};

Standard.parameters = parameters;
