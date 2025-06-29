import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./InlineEdit.stories";
import { InlineEditViewState } from "../../Enums";

const { Standard } = composeStories(stories);

describe("InlineEdit", () => {
  const textContent = "Edit Value";

  test("component must be rendered", async () => {
    render(<Standard />);
    const InlineEdit = await screen.findAllByRole("region");
    expect(InlineEdit[0]).toBeInTheDocument();
  });

  test("innerCtrCls must be applied", async () => {
    const innerCtrCls = "custom-container-class";
    render(<Standard innerCtrCls={innerCtrCls} />);
    const InlineContainer = await screen.findAllByRole("region");
    expect(InlineContainer[0]).toHaveClass(innerCtrCls);
  });

  test("initialValue must be rendered", async () => {
    render(<Standard value={textContent} />);
    const inlineValue = await screen.findByText(textContent);
    expect(inlineValue).toBeInTheDocument();
  });

  test("maxLength must be enforced", async () => {
    const maxLength = 5;
    render(<Standard value={textContent} maxLength={maxLength} />);
    const value = await screen.findByDisplayValue(
      textContent.slice(0, maxLength - 1)
    );
    expect(value).toHaveValue(textContent.slice(0, maxLength));
  });

  test("edit state must be rendered", async () => {
    render(<Standard value={textContent} />);
    const inlineEdit = await screen.findByText(textContent);
    const inlineEditRegion = await screen.findAllByRole("region");
    const inlineEditContainer = inlineEditRegion[0];
    fireEvent.click(inlineEdit);
    expect(inlineEditContainer).toHaveClass("showEditOption");
  });

  test("onCancel click must be disappeared the edit view", async () => {
    render(<Standard value={textContent} />);
    const inlineEdit = await screen.findByText(textContent);
    fireEvent.click(inlineEdit);
    const actionButtons = await screen.findAllByRole("button");
    fireEvent.click(actionButtons[1]);
    const inlineEditRegion = await screen.findAllByRole("region");
    const inlineEditContainer = inlineEditRegion[0];
    expect(inlineEditContainer).not.toHaveClass("showEditOption");
  });
  test("onSubmit  must be invoked", async () => {
    const onSubmit = jest.fn();
    render(
      <Standard
        defaultViewState={InlineEditViewState.EditView}
        onSubmit={onSubmit}
        value={textContent}
      />
    );
    const actionButtons = await screen.findAllByRole("button");
    fireEvent.click(actionButtons[0]);
    expect(onSubmit).toBeCalled();
  });
  test("onCancel  must be invoked", async () => {
    const onCancel = jest.fn();
    render(
      <Standard
        defaultViewState={InlineEditViewState.EditView}
        onCancel={onCancel}
        value={textContent}
      />
    );
    const actionButtons = await screen.findAllByRole("button");
    fireEvent.click(actionButtons[1]);
    expect(onCancel).toBeCalled();
  });
  test("onChange  must be invoked", async () => {
    const onChange = jest.fn();
    const text = "Edited Value";

    render(
      <Standard
        defaultViewState={InlineEditViewState.EditView}
        onChange={onChange}
        value={textContent}
      />
    );
    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: text } });
    expect(onChange).toBeCalled();
  });
  test("canSubmit false  must not invoked onSubmit", async () => {
    const onSubmit = jest.fn();

    render(
      <Standard
        defaultViewState={true}
        onSubmit={onSubmit}
        canSubmit={() => false}
        value={textContent}
      />
    );
    const actionButtons = await screen.findAllByRole("button");
    fireEvent.click(actionButtons[0]);
    expect(onSubmit).not.toBeCalled();
  });
  test("defaultViewState initially open the edit view", async () => {
    render(
      <Standard
        value={textContent}
        defaultViewState={InlineEditViewState.EditView}
      />
    );
    const inlineEditRegion = await screen.findAllByRole("region");
    const inlineEditContainer = inlineEditRegion[0];
    expect(inlineEditContainer).toHaveClass("showEditOption");
  });
  test("isEditable false disable the inline", async () => {
    render(
      <Standard
        isEditable={false}
        value={textContent}
        defaultViewState={InlineEditViewState.EditView}
      />
    );
    const InlineEditRegion = await screen.findAllByRole("region");
    const InlineEdit = InlineEditRegion[0];
    expect(InlineEdit).not.toHaveClass("isEditable");
  });
});
