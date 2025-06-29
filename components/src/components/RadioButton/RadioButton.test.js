import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./RadioButton.stories";
import { RadioButtonOrientation } from "../../Enums";

const { Standard } = composeStories(stories);

describe("RadioButton", () => {
  const contacts = [
    { label: "Ellie", name: "contact", id: "ellie" },
    { label: "Isaac", name: "contact", id: "isaac" },
    { label: "Carver", name: "contact", id: "carver" },
  ];

  test("radio buttons must be rendered", async () => {
    render(<Standard />);
    const radioGroup = await screen.findByRole("radiogroup");
    expect(radioGroup).toBeInTheDocument();
  });

  test("ctrCls must be applied to root element", async () => {
    const ctrCls = "custom radio class";
    render(<Standard ctrCls={ctrCls} />);
    const radioRoot = await screen.findByRole("radiogroup");
    expect(radioRoot).toHaveClass(ctrCls);
  });

  test("radio with an id similar to the selectedGroupId prop must be checked", async () => {
    render(<Standard groups={contacts} selectedGroupId="isaac" />);
    const radioButtons = await screen.findAllByRole("radio");
    expect(radioButtons[1]).toBeChecked();
  });

  test("every radio button group option must be rendered", async () => {
    render(<Standard groups={contacts} />);
    const radioButtons = await screen.findAllByRole("radio");
    expect(radioButtons.length).toBe(3);
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard groups={contacts} onChange={onChange} />);
    const radioButtons = await screen.findAllByRole("radio");
    fireEvent.click(radioButtons[1]);
    expect(onChange).toHaveBeenCalled();
  });

  test("orientation class must be applied", async () => {
    render(<Standard orientation={RadioButtonOrientation.horizontal} />);
    const radioGroup = await screen.findByRole("radiogroup");
    expect(radioGroup).toHaveClass(RadioButtonOrientation.horizontal);
  });
});
