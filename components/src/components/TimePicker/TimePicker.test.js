import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./TimePicker.stories";

const { Standard } = composeStories(stories);

describe("TimePicker", () => {
  test("ctrCls must be applied", async () => {
    const customClass = "custom-time-picker-class";
    render(<Standard ctrCls={customClass} />);
    const componentRegion = await screen.findAllByRole("region");

    const component = componentRegion.find(
      (el) => el.dataset.role === "root-element"
    );
    expect(component).toHaveClass(customClass);
  });

  test("onOkay must be invoked", async () => {
    const onOkay = jest.fn();
    render(<Standard onOkay={onOkay} />);
    const expansionButton = await screen.findAllByRole("button");
    fireEvent.click(expansionButton[0]);
    const buttons = screen.getAllByRole("button");
    const okButton = buttons[buttons.length - 1];
    fireEvent.click(okButton);
    expect(onOkay).toHaveBeenCalled();
  });

  test("time must be rendered", async () => {
    const time = "4:00 pm";
    render(<Standard time={time} />);
    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue(time);
  });

  test("input must be disabled if this prop is set to true", async () => {
    render(<Standard isDisabled={true} />);
    const input = await screen.findByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("name must be applied to the input element", async () => {
    const name = "datepicker-input-name";
    render(<Standard name={name} />);
    const input = await screen.findByRole("textbox");
    expect(input.name).toBe(name);
  });

  test("hour24Mode format must be followed", async () => {
    const time = "3:00 pm";
    render(<Standard isHour24Mode={true} time={time} />);
    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue(time);
  });

  test("canOpenByDefault class must be applied", async () => {
    const label = "Ok";
    render(<Standard canOpenByDefault={true} />);
    const okButtonLabel = await screen.findByText(label);
    expect(okButtonLabel).toBeInTheDocument();
  });

  test("label must be rendered", async () => {
    const label = "custom-time-picker-label";
    render(<Standard label={label} />);
    const labelElement = await screen.findByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test("placeholder must be rendered", async () => {
    const placeholder = "time picker placeholder";
    render(<Standard placeholder={placeholder} />);
    const input = await screen.findByRole("textbox");
    expect(input.placeholder).toBe(placeholder);
  });
});
