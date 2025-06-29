import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Tag.stories";
import { TagColor } from "../../Enums";

const { Standard } = composeStories(stories);

describe("Tag", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const tagContainer = await screen.findByRole("region");
    expect(tagContainer).toHaveClass(ctrCls);
  });

  test("label must be rendered", async () => {
    const label = "Completed";
    render(<Standard label={label} />);
    const tagContainer = await screen.findByRole("region");
    expect(tagContainer).toBeInTheDocument(label);
  });

  test("Color must be applied", async () => {
    const color = TagColor.SUCCESS;
    render(<Standard color={color} />);
    const tagContainer = await screen.findByRole("region");
    expect(tagContainer).toHaveClass(color);
  });
});
