import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./AlertDialog.stories";
import { AlertDialogTypes } from "../../Enums";

jest.mock("framer-motion", () => require("../../../__mocks__/framerMotion"));

const { Error, Success, Warning } = composeStories(stories);

describe("AlertDialog", () => {
  test("component must be rendered", async () => {
    render(<Success isVisible={true} />);
    const dialogBox = await screen.findByRole("dialog");
    expect(dialogBox).toBeInTheDocument();
  });

  test("bodyCtrCls must be applied", async () => {
    const bodyCtrCls = "body class";
    await render(<Success bodyCtrCls={bodyCtrCls} isVisible={true} />);
    const content = screen
      .getAllByRole("region")
      .find((el) => el.dataset.role === "alert-dialog-content");
    expect(content).toHaveClass(bodyCtrCls);
  });

  test("children must be rendered", async () => {
    const child = "child text";
    render(
      <Success content={null} isVisible={true}>
        {child}
      </Success>
    );
    const childElement = await screen.findByText(child);
    expect(childElement).toBeInTheDocument();
  });

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom class";
    render(<Success ctrCls={ctrCls} isVisible={true} />);
    const elementWithCtrCls = await screen.findByRole("dialog");
    expect(elementWithCtrCls).toHaveClass(ctrCls);
  });

  test("content must be reflected", async () => {
    const content = "alert dialog content";
    render(<Success content={content} isVisible={true} />);
    const contentElement = await screen.findByText(content);
    expect(contentElement).toBeInTheDocument();
  });

  test("isDismissible, if true, should have the overlay element rendered", async () => {
    const onDismiss = jest.fn();
    await render(
      <Success isDismissible={true} isVisible={true} onDismiss={onDismiss} />
    );
    const overlay = screen
      .getAllByRole("region")
      .find((el) => el.dataset.role === "overlay");
    fireEvent.click(overlay);
    expect(onDismiss).toHaveBeenCalled();
  });

  test("loading, if true, must render the loading button", async () => {
    render(<Success loading={true} isVisible={true} />);
    const loadingElement = await screen.findByRole("status");
    expect(loadingElement).toBeInTheDocument();
  });

  test("negativeText must be reflected", async () => {
    const negativeText = "negative text";
    render(<Error negativeText={negativeText} isVisible={true} />);
    const negativeElement = await screen.findByText(negativeText);
    expect(negativeElement).toBeInTheDocument();
  });

  test("neutralText must be rendered", async () => {
    const neutralText = "neutral text";
    render(<Warning neutralText={neutralText} isVisible={true} />);
    const neutralElement = await screen.findByText(neutralText);
    expect(neutralElement).toBeInTheDocument();
  });

  test("onDismiss must be invoked", async () => {
    const onDismiss = jest.fn();
    await render(<Success onDismiss={onDismiss} isVisible={true} />);
    const overlayElement = screen
      .getAllByRole("region")
      .find((el) => (el.dataset.role = "overlay"));
    fireEvent.click(overlayElement);
    expect(onDismiss).toHaveBeenCalled();
  });

  test("onNegative must be invoked", async () => {
    const onNegative = jest.fn();
    const negativeText = "negative text";
    render(
      <Error
        onPositive={null}
        negativeText={negativeText}
        onNegative={onNegative}
        isVisible={true}
      />
    );
    const negativeElement = await screen.findByText(negativeText);
    fireEvent.click(negativeElement);
    expect(onNegative).toHaveBeenCalled();
  });

  test("onNeutral must be invoked", async () => {
    const onNeutral = jest.fn();
    const neutralText = "neutral text";
    render(
      <Warning
        onPositive={null}
        onNegative={null}
        neutralText={neutralText}
        onNeutral={onNeutral}
        isVisible={true}
      />
    );
    const neutralElement = await screen.findByText(neutralText);
    fireEvent.click(neutralElement);
    expect(onNeutral).toHaveBeenCalled();
  });

  test("onPositive must be invoked", async () => {
    const onPositive = jest.fn();
    const positiveText = "positive text";
    render(
      <Success
        onPositive={onPositive}
        positiveText="positive text"
        isVisible={true}
      />
    );
    const positiveElement = await screen.findByText(positiveText);
    fireEvent.click(positiveElement);
    expect(onPositive).toHaveBeenCalled();
  });

  test("positive text must be reflected", async () => {
    const positiveText = "positive text";
    render(<Success positiveText={positiveText} isVisible={true} />);
    const positiveElement = await screen.findByText(positiveText);
    expect(positiveElement).toBeInTheDocument();
  });

  test("title must be reflected", async () => {
    const title = "alert dialog title";
    render(<Success title={title} isVisible={true} />);
    const titleElement = await screen.findByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test("isVisible, if true, must cause the component to be rendered", async () => {
    render(<Success isVisible={true} />);
    const dialogElement = await screen.findByRole("dialog");
    expect(dialogElement).toBeInTheDocument();
  });

  test("type must be reflected in the data attribute", async () => {
    // const type = AlertDialogTypes.WARNING;
    render(<Success isVisible={true} />);
    const dialogElement = await screen.findByRole("dialog");
    expect(dialogElement.dataset.type).toBe(AlertDialogTypes.SUCCESS);
  });
});
