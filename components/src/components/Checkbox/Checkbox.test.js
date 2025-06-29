import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Checkbox.stories";

const { Standard } = composeStories(stories);

describe("Checkbox", () => {
  test("component must be rendered", async () => {
    render(<Standard />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const checkContainer = await screen.findByRole("region");
    expect(checkContainer).toHaveClass(ctrCls);
  });

  test("disabled status must be applied", async () => {
    render(<Standard disabled={true} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("name must be applied", async () => {
    const inputName = "check-name";
    render(<Standard inputName={inputName} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox.name).toBe(inputName);
  });

  test("label must be rendered", async () => {
    const label = "checkbox-label";
    render(<Standard label={label} />);
    const labelElement = await screen.findByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard disabled={false} onChange={onChange} />);
    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });

  test("value must be reflected", async () => {
    const isChecked = true;
    render(<Standard isChecked={isChecked} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
});
