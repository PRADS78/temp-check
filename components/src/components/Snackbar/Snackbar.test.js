import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Snackbar.stories";
import { SnackBarDuration } from "../../Enums";

const {
  Basic,
  ActionDismiss,
  Action,
  MessageType,
  ShortDurationSnackbar,
  LongDurationSnackbar,
  IndefiniteDurationSnackbar,
} = composeStories(stories);

describe("SnackBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("component must be rendered", async () => {
    render(<Basic />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");
    expect(dialogBox).toBeInTheDocument();
  });

  test("message must be rendered", async () => {
    const messageContent =
      "Tact is the art of making a point without making an enemy.";
    render(<Basic message={messageContent} />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogContent = screen.getByRole("caption");
    expect(dialogContent).toBeInTheDocument();
  });

  test("ctrCls must be present in the snack bar", async () => {
    const ctrCls = "custom-snack-class";
    render(<Basic ctrCls={ctrCls} />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");
    expect(dialogBox).toHaveClass(ctrCls);
  });

  test("action button must be rendered", async () => {
    const action = {
      label: "Undo",
    };
    render(<Action action={action} />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const actionButton = screen.getByText("Undo");
    expect(actionButton).toBeInTheDocument();
  });

  test("action onclick must be invoked", async () => {
    const action = {
      label: "Button",
      onClick: jest.fn(),
    };
    render(<ActionDismiss action={action} />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const actionButton = screen.getByText("Button");
    fireEvent.click(actionButton);

    expect(action.onClick).toHaveBeenCalled();
  });

  test("when no action and no dismiss button must not be present in the snack bar", async () => {
    render(<Basic />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    //filtering the buttons expect show button and hide button
    const buttons = screen
      .getAllByRole("button")
      .filter(
        (button) => ["Show", "Hide"].includes(button.textContent) == false
      );

    expect(buttons.length).toEqual(0);
  });

  test("dismiss button and action button must be rendered", async () => {
    render(<ActionDismiss />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    //filtering the buttons expect show button
    const buttons = screen
      .getAllByRole("button")
      .filter(
        (button) => ["Show", "Hide"].includes(button.textContent) == false
      );

    expect(buttons.length).toEqual(2);
  });

  test("dismiss onclick must be invoked", async () => {
    render(<ActionDismiss />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    const dismissButton = screen.getByText("Dismiss");
    fireEvent.click(dismissButton);
    expect(snackbar).not.toHaveClass("entering");
  });

  test("typed component must be render", async () => {
    render(<MessageType />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");

    expect(dialogBox).toHaveClass("typeContainer");
  });

  test("customised title for typed component must be render", async () => {
    const title = "Whoops!";
    render(<MessageType title={title} />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");

    expect(dialogBox).toBeInTheDocument(title);
  });

  test("no type then the typed component must not be render", async () => {
    render(<Basic />);
    const toggleButton = await screen.findByText("Show");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");

    expect(dialogBox).not.toHaveClass("typeContainer");
  });

  test("hide event must be invoked", async () => {
    render(<ActionDismiss />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    const dismissButton = screen.getByText("Hide");
    fireEvent.click(dismissButton);
    expect(snackbar).not.toHaveClass("entering");
  });

  test("short duration snackbar must be hidden after short duration", async () => {
    render(<ShortDurationSnackbar />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    expect(snackbar).toHaveClass("entering");
    await waitFor(() => expect(snackbar).not.toHaveClass("entering"), {
      timeout: SnackBarDuration.SHORT + 1,
    });
  });

  test("long duration snackbar must be hidden after long duration", async () => {
    render(<LongDurationSnackbar />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    expect(snackbar).toHaveClass("entering");
    await waitFor(() => expect(snackbar).not.toHaveClass("entering"), {
      timeout: SnackBarDuration.LONG + 1,
    });
  });

  test("indefinite duration snackbar must not be hidden", async () => {
    render(<IndefiniteDurationSnackbar />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    expect(snackbar).toHaveClass("entering");
    await waitFor(() => expect(snackbar).toHaveClass("entering"), {
      timeout: SnackBarDuration.LONG + 10,
    });
    const dismissButton = screen.getByText("Hide");
    fireEvent.click(dismissButton);
    expect(snackbar).not.toHaveClass("entering");
  });

  test("default duration for snackbar should be long", async () => {
    render(<Basic />);
    const toggleButton = await screen.findByText("Show");
    const snackbar = screen.getByRole("dialog");
    fireEvent.click(toggleButton);
    expect(snackbar).toHaveClass("entering");
    await waitFor(() => expect(snackbar).toHaveClass("entering"), {
      timeout: SnackBarDuration.SHORT + 1,
    });
    await waitFor(() => expect(snackbar).not.toHaveClass("entering"), {
      timeout: SnackBarDuration.LONG + 1,
    });
  });
});
