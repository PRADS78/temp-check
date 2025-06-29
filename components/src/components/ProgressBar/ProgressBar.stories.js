import { ProgressBarSize } from "../../Enums";
import ProgressBar from "./ProgressBar";

const storyConfig = {
  title: "Disprz/DisprzProgressBar",
  component: ProgressBar,
};

export default storyConfig;

const Template = (args) => {
  return (
    <div data-testid="progressbar" style={{ width: "260px" }}>
      <ProgressBar {...args} />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  value: 10,
};

export const BigLine = Template.bind({});

BigLine.args = {
  ...Standard.args,
  size: ProgressBarSize.BIG,
  value: 30,
};
