import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Slider.stories";
import { Size, SliderTypes } from "../../Enums";
//import userEvent from "@testing-library/user-event";

const { Standard, Discrete, MinMax } = composeStories(stories);

describe("Slider", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const sliderContainer = await screen.findByRole("region");
    expect(sliderContainer).toHaveClass(ctrCls);
  });

  test("size  must be applied", async () => {
    const size = Size.LARGE;
    render(<Standard size={size} />);
    const sliderContainer = await screen.findByRole("region");
    expect(sliderContainer).toHaveClass("large");
  });

  test("isDisabled  must be applied", async () => {
    const isDisabled = true;
    render(<Standard isDisabled={isDisabled} />);
    const sliderContainer = await screen.findByRole("region");
    expect(sliderContainer).toHaveClass("disabled");
  });

  test("default value  must be applied", async () => {
    const defaultValue = "40";
    render(<Standard defaultValue={defaultValue} />);
    const slider = await screen.findByRole("slider");
    expect(slider.value).toBe(defaultValue);
  });

  test("start, end and multiplier value  must be applied", async () => {
    const start = "10";
    const end = "110";
    const multiplier = "10";
    render(
      <Discrete
        min={start}
        max={end}
        step={multiplier}
        type={SliderTypes.DISCRETE}
      />
    );
    const slider = await screen.findByRole("slider");
    expect(slider.min).toBe(start);
    expect(slider.max).toBe(end);
    expect(slider.step).toBe(multiplier);
  });
  test("Value must be set correctly", async () => {
    const mockFn = jest.fn();
    render(<MinMax min={10} max={90} onChange={mockFn} />);
    const sliderInput = await screen.findByRole("slider");
    fireEvent.change(sliderInput, { target: { value: 5 } });

    expect(sliderInput.value).toBe("10");

    fireEvent.change(sliderInput, { target: { value: 30 } });

    expect(sliderInput.value).toBe("30");
  });
  test("onRange must be invoked", async () => {
    const mockFn = jest.fn();
    render(<MinMax min={10} max={90} onChange={mockFn} />);
    const sliderInput = await screen.findByRole("slider");
    fireEvent.input(sliderInput, { target: { value: 20 } });
    expect(sliderInput.value).toBe("20");
  });
});
