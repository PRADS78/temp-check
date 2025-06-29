import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Badges.stories";

const { Standard } = composeStories(stories);

describe("Badges", () => {
  test("component must be rendered", async () => {
    await render(<Standard />);
    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
  });

  test("ctrCls must be rendered", async () => {
    const ctrCls = "badges";
    await render(<Standard ctrCls={ctrCls} />);
    const badgeContainer = screen.getByTestId("badge-container");
    expect(badgeContainer).toHaveClass(ctrCls);
  });

  test("Count must be rendered", async () => {
    const count = 10;
    await render(<Standard count={count} />);
    const badge = screen.getByRole("status");
    expect(within(badge).getByText(count)).toBeInTheDocument();
  });

  test("Count must not render above max value", async () => {
    const count = 100,
      max = 90;
    await render(<Standard count={count} max={90} />);
    const badge = screen.getByRole("status");
    expect(within(badge).getByText(`${max}+`)).toBeInTheDocument();
  });

  test("Children must be rendered", async () => {
    await render(
      <Standard>
        <span>This is children</span>
      </Standard>
    );
    const badgeContainer = screen.getByTestId("badge-container");
    expect(
      within(badgeContainer).getByText("This is children")
    ).toBeInTheDocument();
  });
});
