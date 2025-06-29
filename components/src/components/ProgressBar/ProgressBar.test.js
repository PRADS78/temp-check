import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./ProgressBar.stories";

const { Standard } = composeStories(stories);

describe("ProgressBar", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const progressContainer = await screen.findByRole("region");
    expect(progressContainer).toHaveClass(ctrCls);
  });
  test("Progress value must be applied", async () => {
    const filledPercent = 30;
    render(<Standard value={filledPercent} />);
    const filledContainer = await screen.findByRole("status");
    expect(filledContainer).toHaveStyle(`width: ${filledPercent}%`);
  });
  test("Progress color must be applied", async () => {
    const filledCtrCls = "custom-filled-class";
    render(<Standard filledCtrCls={filledCtrCls} />);
    const checkContainer = await screen.findByRole("status");
    expect(checkContainer).toHaveClass(filledCtrCls);
  });
  test("Progress size must be applied", async () => {
    const size = "big";
    render(<Standard size={size} />);
    const checkContainer = await screen.findByRole("region");
    expect(checkContainer).toHaveClass("bigLine");
  });
});
