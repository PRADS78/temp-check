import { Size, SliderTypes } from "../../Enums";
import Slider from "./Slider";

const storyConfig = {
  title: "Disprz/DisprzSlider",
  component: Slider,
};

export default storyConfig;

const Template = (args) => {
  return (
    <div data-testid="slider-container" style={{ width: "342px" }}>
      <Slider
        {...args}
        onChange={(start, end, multiplier, value) => {
          console.log("changes", start, end, multiplier, value);
        }}
      />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  type: SliderTypes.CONTINUOUS,
  start: 0,
  end: 100,
  size: Size.SMALL,
};

export const MinMax = Template.bind({});
MinMax.args = {
  ...Standard.args,
  start: 0,
  end: 100,
  min: 10,
  max: 80,
};
export const Discrete = Template.bind({});

Discrete.args = {
  ...Standard.args,
  type: SliderTypes.DISCRETE,
  start: 10,
  end: 110,
  min: 10,
  max: 110,
  multiplier: 10,
  size: Size.SMALL,
};

export const BigSlider = Template.bind({});

BigSlider.args = {
  ...Standard.args,
  size: Size.LARGE,
};

export const DefaultValue = Template.bind({});

DefaultValue.args = {
  ...Standard.args,
  defaultValue: 60,
};

export const Disabled = Template.bind({});

Disabled.args = {
  ...Standard.args,
  isDisabled: true,
  defaultValue: 60,
};
