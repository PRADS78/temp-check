import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Switch.stories";

const { Standard } = composeStories(stories);

describe("Switch", () => {
  test("on status must be reflected", async () => {
    render(<Standard on={true} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-switch-class";
    render(<Standard ctrCls={ctrCls} />);
    const container = await screen.findByRole("switch");
    expect(container).toHaveClass(ctrCls);
  });

  test("disabled status must be reflected", async () => {
    render(<Standard disabled={true} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("name must be applied to the checkbox", async () => {
    const name = "custom-switch";
    render(<Standard name={name} />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox.name).toBe(name);
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} />);
    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalled();
  });
});
