import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Label.stories";

const { Standard } = composeStories(stories);

describe("Label", () => {
  test("ctrCls", async () => {
    const ctrCls = "custom-class";
    render(<Standard ctrCls={ctrCls} />);
    const rootElemenRegiont = await screen.findAllByRole("region");
    const rootElement = rootElemenRegiont[0];
    expect(rootElement).toHaveClass(ctrCls);
  });

  test("asterisk must be rendered if the value from the labeled element is required", async () => {
    render(<Standard isRequired={true} />);
    const asterisk = await screen.findByRole("suggestion");
    expect(asterisk).toBeInTheDocument();
  });

  test("text must be rendered", async () => {
    const text = "label text";
    render(<Standard text={text} />);
    const textElement = await screen.findByText(text);
    expect(textElement).toBeInTheDocument();
  });

  test("if helptext has value icon must be rendered", async () => {
    const helpText = "helping text";
    render(<Standard helpText={helpText} />);
    const infoIconElement = await screen.findByRole("button");
    expect(infoIconElement).toHaveClass("app-icon-ctr");
  });
});
