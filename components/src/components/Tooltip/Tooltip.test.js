import { composeStories } from "@storybook/testing-react";
import { render, screen, waitFor, within } from "@testing-library/react";
import * as stories from "./Tooltip.stories";
import userEvent from "@testing-library/user-event";

const { WithoutTitle, WithTitle, ProgressType } = composeStories(stories);

describe("Tooltip", () => {
  test("Empty Component must be rendered", async () => {
    await render(<WithoutTitle message="Message" />);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  test("message must be rendered", async () => {
    const message = "Message";
    await render(<WithoutTitle {...WithoutTitle.args} message={message} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const tooltip = screen.getByRole("tooltip");
    expect(within(tooltip).getByText(message)).toBeInTheDocument();
  });

  test("message must not be rendered", async () => {
    const message = "Message";
    await render(<WithoutTitle {...WithoutTitle.args} message={message} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const tooltip = screen.getByRole("tooltip");
    expect(within(tooltip).getByText(message)).toBeInTheDocument();
    await userEvent.unhover(reference);
    await waitFor(() =>
      expect(within(tooltip).queryByText(message)).not.toBeInTheDocument()
    );
  });

  test("title must be rendered", async () => {
    const title = "Title";
    await render(<WithTitle {...WithoutTitle.args} title={title} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const tooltip = screen.getByRole("tooltip");
    expect(within(tooltip).getByText(title)).toBeInTheDocument();
  });

  test("title must not be rendered", async () => {
    const title = "Title";
    await render(<WithTitle {...WithoutTitle.args} title={""} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const tooltip = screen.getByRole("tooltip");
    expect(within(tooltip).queryByText(title)).not.toBeInTheDocument();
  });

  test("progress type must render sharp arrow type", async () => {
    await render(<ProgressType {...ProgressType.args} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const arrow = await screen.findByTestId("popper-arrow");
    expect(arrow).toHaveClass("sharpType");
    expect(arrow).not.toHaveClass("smoothType");
  });

  test("smooth type must render by default", async () => {
    await render(<WithTitle {...WithTitle.args} />);
    const container = screen.getByTestId("tooltip-container");
    const reference = within(container).getByTestId("tooltip-reference");
    await userEvent.hover(reference);
    const arrow = await screen.findByTestId("popper-arrow");
    expect(arrow).toHaveClass("smoothType");
    expect(arrow).not.toHaveClass("sharpType");
  });

  // TODO:
  // Popper
  // 1. Validate Arrow type
  // 2. Validate Popper placement/position
  // 3. Validate Popper modifiers
  // 4. Validate Popper inner container class
  // 5. Validate Popper canShowArrow
  // 6. Validate Popper referenceElement
  // 7. Validate Popper isPortal
  // 8. Validate Popper arrowType
  // 9. Validate Popper children

  // Tooltip
  // 1. Validate Tooltip type
});
