import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Accordion.stories";

const { Standard, WithCustomActions } = composeStories(stories);

describe("Accordion", () => {
  test("Title must be rendered", async () => {
    const titleText = {
      label: "Text Goes Here",
    };
    await act(async () => await render(<Standard title={titleText} />));
    const title = screen.getByText(titleText.label);
    expect(title).toBeInTheDocument();
  });

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-class";
    await act(async () => await render(<Standard ctrCls={ctrCls} />));
    const rootElement = screen.getAllByRole("region")[0];
    expect(rootElement).toHaveClass(ctrCls);
  });

  test("customActionCtr must be applied", async () => {
    const ctrCls = "custom-class";
    await act(
      async () => await render(<WithCustomActions customActionCtr={ctrCls} />)
    );
    const rootElement = screen.getByTestId("custom-container");
    expect(rootElement).toHaveClass(ctrCls);
  });

  test("arrowIcon must be rendered", async () => {
    await act(async () => await render(<Standard />));
    const arrowIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "arrow");
    expect(arrowIcon[0]).toBeInTheDocument();
  });

  test("accordion must be opened on triggering accordionArrowIcon", async () => {
    const onClick = jest.fn();
    render(<Standard onClick={onClick} />);
    const buttons = await screen.findAllByRole("button");

    const arrowIcon = buttons.filter(
      (button) => button.dataset.role === "arrow"
    );
    fireEvent.click(arrowIcon[0]);
    expect(onClick).toHaveBeenCalled();
  });

  test("actionButtons must be rendered", async () => {
    let actions = [
      {
        label: "Edit",
        value: 0,
        onClick: () => {},
      },
      {
        label: "Cancel",
        value: 0,
        onClick: () => {},
      },
    ];
    const plainBtnCtrCls = "plain";
    const primaryBtnCtrCls = "primary";
    await act(async () => await render(<Standard actions={actions} />));
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass(primaryBtnCtrCls);
    expect(buttons[1]).toHaveClass(plainBtnCtrCls);
  });

  test("menuOption must be rendered", async () => {
    let actions = [
      {
        label: "Edit",
        value: 0,
        onClick: () => {},
      },
      {
        label: "Cancel",
        value: 0,
        onClick: () => {},
      },
    ];
    const actionBtnCtrCls = "options";
    await act(
      async () =>
        await render(
          <Standard noOfActionsToRenderUpFront={0} actions={actions} />
        )
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveClass(actionBtnCtrCls);
  });

  test("accordion must be opened while triggering header", async () => {
    const titleText = {
      label: "Text Goes Here",
    };
    const onClick = jest.fn();
    render(
      <Standard
        onClick={onClick}
        enableBodyOpenOnHeaderClick={true}
        isHeaderTitleEditable={false}
        title={titleText}
      />
    );
    const titleElement = await screen.findByText(titleText.label);
    fireEvent.click(titleElement);
    expect(onClick).toHaveBeenCalled();
  });

  test("accordion style must be applied on accordion open state ", async () => {
    const openClass = "wobbleRotateAppearActive";
    render(<Standard isOpen={true} />);
    const buttons = await screen.findAllByRole("button");

    const arrowIcon = buttons.filter(
      (button) => button.dataset.role === "arrow"
    );
    expect(arrowIcon[0]).toHaveClass(openClass);
  });

  test("accordion style must be applied on accordion closed state ", async () => {
    const openClass = "wobbleRotateAppearActive";
    await render(<Standard isOpen={false} />);
    const buttons = await screen.findAllByRole("button");

    const arrowIcon = buttons.filter(
      (button) => button.dataset.role === "arrow"
    );
    expect(arrowIcon[0]).not.toHaveClass(openClass);
  });

  test("custom action must be render", async () => {
    const customClass = "customActionContainer";
    render(<WithCustomActions />);
    const customComponent = await screen.findByTestId("custom-container");
    expect(customComponent).toHaveClass(customClass);
  });
});
