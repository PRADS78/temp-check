import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Counter.stories";

const { Disabled, Standard, WithError } = composeStories(stories);

describe("Counter", () => {
  test("decrease button must be disabled if value is equal to min", async () => {
    const value = 10;
    await render(<Standard value={value} min={value} />);
    const buttons = screen.getAllByRole("button");
    const decreaseButton = buttons.find(
      (button) => button.dataset.name === "decrease-button"
    );
    expect(decreaseButton).toBeDisabled();
  });

  test("disabled state must render the input element to also be disabled", async () => {
    await render(<Disabled />);
    const input = screen.getByRole("spinbutton");
    expect(input).toBeDisabled();
  });

  test("increase button must be disabled if value is equal to max", async () => {
    const value = 50;
    await render(<Standard value={value} max={value} />);
    const buttons = screen.getAllByRole("button");
    const increaseButton = buttons.find(
      (button) => button.dataset.name === "increase-button"
    );
    expect(increaseButton).toBeDisabled();
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    const text = 1;
    await render(<Standard onChange={onChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: text } });
    expect(onChange).toHaveBeenCalled();
  });

  test("onDecrease must be invoked", async () => {
    const onDecrease = jest.fn();
    await render(<Standard value={10} min={5} onDecrease={onDecrease} />);
    const buttons = screen.getAllByRole("button");
    const decreaseButton = buttons.find(
      (button) => button.dataset.name === "decrease-button"
    );
    fireEvent.click(decreaseButton);
    expect(onDecrease).toBeCalled();
  });

  test("onIncrease must be invoked", async () => {
    const onIncrease = jest.fn();
    await render(<Standard onIncrease={onIncrease} />);
    const buttons = screen.getAllByRole("button");
    const increaseButton = buttons.find(
      (button) => button.dataset.name === "increase-button"
    );
    fireEvent.click(increaseButton);
    expect(onIncrease).toBeCalled();
  });

  test("onIncrease should not increase value beyond max", async () => {
    const onIncrease = jest.fn();
    await render(<Standard value={49.1} max={50} onIncrease={onIncrease} />);
    const buttons = screen.getAllByRole("button");
    const increaseButton = buttons.find(
      (button) => button.dataset.name === "increase-button"
    );
    fireEvent.click(increaseButton);
    expect(onIncrease).toBeCalled();
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(50);
  });

  test("onDecrease should not decrease value beyond min", async () => {
    const onDecrease = jest.fn();
    await render(<Standard value={10.1} min={10} onDecrease={onDecrease} />);
    const buttons = screen.getAllByRole("button");
    const decreaseButton = buttons.find(
      (button) => button.dataset.name === "decrease-button"
    );
    fireEvent.click(decreaseButton);
    expect(onDecrease).toBeCalled();
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(10);
  });

  test("negative numbers should not be allowed", async () => {
    const onChange = jest.fn();
    await render(<Standard />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "-1" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test("should conditionally allow changing value by input", async () => {
    const onChange = jest.fn();
    await render(<Standard shouldEnableValueChangeByInput={false} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "text" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test("value must be reflected in the input element", async () => {
    const value = 11;
    await render(<Standard value={value} />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(value);
  });

  test("input should reset to nearest min on increase if value is less than min", async () => {
    await render(<WithError min={2} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "-1" } });
    const buttons = screen.getAllByRole("button");
    const increaseButton = buttons.find(
      (button) => button.dataset.name === "increase-button"
    );
    fireEvent.click(increaseButton);
    expect(input).toHaveValue(2);
  });

  test("input should reset to nearest max on decrease if value is greater than max", async () => {
    await render(<WithError max={50} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "52" } });
    const buttons = screen.getAllByRole("button");
    const decreaseButton = buttons.find(
      (button) => button.dataset.name === "decrease-button"
    );
    fireEvent.click(decreaseButton);
    expect(input).toHaveValue(50);
  });

  test("onInvalidInput must be invoked when value is less than min/max via input", async () => {
    const onInvalidInput = jest.fn();
    const min = 2,
      max = 5;
    await render(
      <WithError onInvalidInput={onInvalidInput} min={min} max={max} />
    );
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "1" } });
    expect(onInvalidInput).toBeCalled();
    fireEvent.change(input, { target: { value: "6" } });
    expect(onInvalidInput).toBeCalled();
  });
});
