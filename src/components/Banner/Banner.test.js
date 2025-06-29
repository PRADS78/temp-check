import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Banner.stories";

const { Standard, EndToEndDefault, EndToEndAlert } = composeStories(stories);

describe("Banner", () => {
  test("ctrCls must be applied to the banner", async () => {
    const ctrCls = "custom-banner-style";
    render(<Standard ctrCls={ctrCls} />);
    const banner = await screen.findByRole("region");
    expect(banner).toHaveClass(ctrCls);
  });

  test("title must be rendered", async () => {
    const title = "Sample Title";
    render(<Standard title={title} />);
    const banner = await screen.findByRole("region");
    expect(banner).toBeInTheDocument(title);
  });

  test("content must be rendered", async () => {
    const content =
      "If at any point you get stuck, have questions or need assistance please don’t hesitate to reach out in the #polaris Slack channel.";
    render(<Standard content={content} />);
    const banner = await screen.findByRole("region");
    expect(banner).toBeInTheDocument(content);
  });

  test("close icon must be rendered", async () => {
    const canShowClose = true;
    render(<Standard canShowClose={canShowClose} />);
    const buttons = await screen.findAllByRole("button");
    const closeButton = buttons.filter(
      (button) => button.dataset.role === "close"
    );
    expect(closeButton[0]).toBeInTheDocument();
  });

  test("onClose must be invoked", async () => {
    const onClose = jest.fn();
    render(<Standard onClose={onClose} canShowClose={true} />);
    const buttons = await screen.findAllByRole("button");
    const closeButton = buttons.filter(
      (button) => button.dataset.role === "close"
    );
    fireEvent.click(closeButton[0]);
    expect(onClose).toHaveBeenCalled();
  });

  test("banner must render default end to end type", async () => {
    const content = "Alert Default Message";
    const onClose = jest.fn();
    render(<EndToEndDefault content={content} onClose={onClose} />);
    const banner = await screen.findByRole("region");
    expect(banner).toHaveTextContent(content);
    const closeButton = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "close");
    expect(closeButton[0]).toBeInTheDocument();
    fireEvent.click(closeButton[0]);
    expect(onClose).toBeCalled();
  });

  test("banner must render default end to end type", async () => {
    const content = "Banner Alert Message";
    const onClose = jest.fn();
    render(<EndToEndAlert content={content} onClose={onClose} />);
    const banner = await screen.findByRole("region");
    expect(banner).toHaveTextContent(content);
    const closeButton = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "close");
    expect(closeButton[0]).toBeInTheDocument();
    fireEvent.click(closeButton[0]);
    expect(onClose).toBeCalled();
  });

  test("canShowClose must not render close icon", () => {
    render(<Standard canShowClose={false} />);
    const closeButton = screen
      .queryAllByRole("button")
      .filter((button) => button.dataset.role === "close");
    expect(closeButton.length).toBe(0);
  });
});
