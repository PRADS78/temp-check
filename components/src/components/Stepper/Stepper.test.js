import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Stepper.stories";
import { StepperStepType } from "../../Enums";

const { Standard } = composeStories(stories);

describe("Stepper", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-stepper-class";
    render(<Standard ctrCls={ctrCls} />);
    const rootElement = await screen.findAllByRole("region");
    expect(rootElement[0]).toHaveClass(ctrCls);
  });

  test("data steps must be rendered", async () => {
    render(<Standard />);
    const steps = await screen.findAllByRole("listitem");
    expect(steps.length).toBe(3);
  });

  test("data content and doneTemplate must be rendered", async () => {
    const dataLength = Standard.args.data.length;
    render(<Standard />);
    const panels = await screen.findAllByRole("tabpanel");
    expect(dataLength + 1).toEqual(panels.length);
  });

  test("stepper head nonclickable, when stepper type is Linear", async () => {
    const ctrCls = "default";
    render(<Standard type={StepperStepType.LINEAR} />);
    const rootElement = await screen.findAllByRole("listitem");
    expect(rootElement[1]).toHaveClass(ctrCls);
  });

  test("stepper head clickable, when stepper type is Non-Linear", async () => {
    const ctrCls = "unlocked";
    render(<Standard type={StepperStepType.NON_LINEAR} />);
    const rootElement = await screen.findAllByRole("listitem");
    expect(rootElement[1]).toHaveClass(ctrCls);
  });

  test("stepper head blocked on unvisit tab, when stepper type is Partial Linear", async () => {
    const ctrCls = "locked";
    render(<Standard type={StepperStepType.PARTIAL_LINEAR} />);
    const rootElement = await screen.findAllByRole("listitem");
    expect(rootElement[1]).toHaveClass(ctrCls);
  });
});
