import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./DialogBox.stories";

const { Standard, DisabledActionButtons } = composeStories(stories);

describe("DialogBox", () => {
  test("component must be rendered", async () => {
    render(<Standard />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const dialogBox = screen.getByRole("dialog");
    expect(dialogBox).toBeInTheDocument();
  });

  test("ctrCls must be present in the dialog box", async () => {
    const ctrCls = "custom-dialog-class";
    render(<Standard ctrCls={ctrCls} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const dialogBox = await screen.findByRole("dialog");
    expect(dialogBox).toHaveClass(ctrCls);
  });

  test("content must be rendered", async () => {
    const content =
      "Tact is the art of making a point without making an enemy.";
    render(<Standard content={content} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const dialogContent = await screen.findByText(content);
    expect(dialogContent).toBeInTheDocument();
  });

  test("close button must be rendered", async () => {
    render(<Standard />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const closeButton = await screen.findByText("Cancel");
    expect(closeButton).toBeInTheDocument();
  });

  test("header close button must be rendered", async () => {
    render(<Standard />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const headerCloseButton = screen.getByRole("dismissdialog");
    expect(headerCloseButton).toBeInTheDocument();
  });

  test("ok button must be rendered", async () => {
    render(<Standard />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const okButton = await screen.findByText("Ok");
    expect(okButton).toBeInTheDocument();
  });

  test("ok button label must be rendered", async () => {
    const okButtonLabel = "Submit";
    render(<Standard okButtonLabel={okButtonLabel} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const okButton = await screen.findByText(okButtonLabel);
    expect(okButton).toBeInTheDocument();
  });

  test("close button label must be rendered", async () => {
    const closeButtonLabel = "Exit";
    render(<Standard closeButtonLabel={closeButtonLabel} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const closeButton = await screen.findByText(closeButtonLabel);
    expect(closeButton).toBeInTheDocument();
  });

  test("action buttons must be rendered", async () => {
    const firstActionButtonLabel = "Action";
    const secondActionButtonLabel = "Reaction";
    const actionButtons = [
      <button key={0}>{firstActionButtonLabel}</button>,
      <button key={1}>{secondActionButtonLabel}</button>,
    ];
    render(<Standard actionButtons={actionButtons} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const firstActionButton = await screen.findByText(firstActionButtonLabel);
    const secondActionButton = await screen.findByText(secondActionButtonLabel);
    expect(firstActionButton).toBeInTheDocument();
    expect(secondActionButton).toBeInTheDocument();
  });

  test("on close button click must be invoked", async () => {
    const onCloseButtonClick = jest.fn();
    render(<Standard onCloseButtonClick={onCloseButtonClick} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const closeButton = await screen.findByText("Cancel");
    fireEvent.click(closeButton);
    expect(onCloseButtonClick).toHaveBeenCalled();
  });

  test("onOkButtonClick must be invoked", async () => {
    const onOkButtonClick = jest.fn();
    render(<Standard onOkButtonClick={onOkButtonClick} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const okButton = await screen.findByText("Ok");
    fireEvent.click(okButton);
    expect(onOkButtonClick).toHaveBeenCalled();
  });

  test("title must be rendered", async () => {
    const title = "Dialog title";
    render(<Standard title={title} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const titleElement = await screen.findByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test("onDismissDialogBox must be invoked", async () => {
    const onDismissDialogBox = jest.fn();
    render(<Standard onDismissDialogBox={onDismissDialogBox} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const dismissDialogButton = screen.getByRole("dismissdialog");
    fireEvent.click(dismissDialogButton);
    expect(onDismissDialogBox).toHaveBeenCalled();
  });

  test("dialog loader must be rendered", async () => {
    render(<Standard isLoading={true} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const loadingButton = screen.getByRole("status");
    expect(loadingButton).toBeInTheDocument();
  });

  test("child component must be rendered", async () => {
    const childText =
      "If I have seen further it is by standing on the shoulders of giants.";
    const childComponent = <div>{childText}</div>;
    render(<Standard>{childComponent}</Standard>);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const childElement = screen.getByText(childText);
    expect(childElement).toBeInTheDocument();
  });

  test("ok button must be disabled", async () => {
    const onOkButtonClick = jest.fn();
    render(<DisabledActionButtons onOkButtonClick={onOkButtonClick} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const okButton = screen.getAllByRole("button")[1];
    expect(okButton).toBeDisabled();
    fireEvent.click(okButton);
    expect(onOkButtonClick).not.toHaveBeenCalled();
  });

  test("cancel button must be disabled", async () => {
    const onCloseButtonClick = jest.fn();
    render(<DisabledActionButtons onCloseButtonClick={onCloseButtonClick} />);
    const toggleButton = await screen.findByText("Toggle");
    fireEvent.click(toggleButton);
    const closeButton = screen.getAllByRole("button")[0];
    expect(closeButton).toBeDisabled();
    fireEvent.click(closeButton);
    expect(onCloseButtonClick).not.toHaveBeenCalled();
  });
});
