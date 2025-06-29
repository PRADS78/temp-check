import { Switch } from ".";
import { useArgs } from "@storybook/client-api";

const storyConfig = {
  title: "Disprz/DisprzSwitch",
  component: Switch,
};

export default storyConfig;

function Template(args) {
  const [{ on }, updateArgs] = useArgs();
  return (
    <div
      data-testid="switch-container"
      style={{ padding: "15px" }}
      onChange={() => updateArgs({ on: !on })}
    >
      <Switch {...args} uniqueId={1666955152427} />
    </div>
  );
}

export const Standard = Template.bind({
  on: false,
});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  on: false,
};

const parameters = {
  jest: ["Switch.test.js"],
};

Standard.parameters = Disabled.parameters = parameters;
