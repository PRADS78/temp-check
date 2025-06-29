import { act, fireEvent, render, screen, within } from "test-utils";

import Popper from "./Popper";
import { ArrowPointType, PopperPlacements } from "../../Enums/index";

describe("Popper", () => {
  beforeAll(() => {
    const body = document.body;
    const div = document.createElement("div");
    div.style.height = "100px";
    div.style.width = "100px";

    div.setAttribute("data-testid", "disprz-popper-reference");
    body.appendChild(div);
  });

  test("component must be rendered", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper isVisible={false} referenceElement={referenceElement}>
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("isPortal must render the children in the portal", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={false}
            referenceElement={referenceElement}
            isPortal
          >
            <div>Test</div>
          </Popper>
        )
    );
    const portalPopper = document.getElementById("disprz-popper");
    expect(within(portalPopper).getByRole("dialog")).toBeInTheDocument();
  });

  test("isPortal false must render the children near the reference and not in portal", async () => {
    const body = document.body;
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={false}
            referenceElement={referenceElement}
            isPortal={false}
          >
            <div>Test</div>
          </Popper>
        )
    );
    const portalPopper = document.getElementById("disprz-popper");
    expect(within(portalPopper).queryByRole("dialog")).not.toBeInTheDocument();
    expect(within(body).getByRole("dialog")).toBeInTheDocument();
  });

  test("ctrCls must be applied", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={false}
            referenceElement={referenceElement}
            ctrCls="test"
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByRole("dialog")).toHaveClass("test");
  });

  test("children must be rendered when isVisible is true", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper isVisible={true} referenceElement={referenceElement}>
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("children must not be rendered when isVisible is false", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper isVisible={false} referenceElement={referenceElement}>
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("clicking outside must call onClickOutside", async () => {
    const body = document.body;
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    const onClickOutside = jest.fn();
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            onClickOutside={onClickOutside}
          >
            <div>Test</div>
          </Popper>
        )
    );
    fireEvent.click(body);
    expect(onClickOutside).toHaveBeenCalled();
  });

  test("clicking inside must not call onClickOutside", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    const onClickOutside = jest.fn();
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            onClickOutside={onClickOutside}
          >
            <div>Test</div>
          </Popper>
        )
    );
    fireEvent.click(screen.getByText("Test"));
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  test("innerCtrCls must be applied", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            innerCtrCls="test"
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByRole("menu")).toHaveClass("test");
  });

  test("canShowArrow must render the arrow", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            canShowArrow
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByTestId("popper-arrow")).toBeInTheDocument();
  });

  test("canShowArrow must not render the arrow", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            canShowArrow={false}
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.queryByTestId("popper-arrow")).not.toBeInTheDocument();
  });

  test("arrowType smooth must be applied by default", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            canShowArrow
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByTestId("popper-arrow")).toHaveClass("smoothType");
  });

  test("arrowType sharp must be applied", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            canShowArrow
            arrowType={ArrowPointType.SHARP}
            placement={PopperPlacements.RIGHT}
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByTestId("popper-arrow")).toHaveClass("sharpType");
  });

  test("placement must be reflected in attribute", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            placement={PopperPlacements.LEFT}
            canShowArrow
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-popper-placement",
      PopperPlacements.LEFT
    );
  });

  test("role and menuRole must be reflected ", async () => {
    const referenceElement = screen.getByTestId("disprz-popper-reference");
    await act(
      async () =>
        await render(
          <Popper
            isVisible={true}
            referenceElement={referenceElement}
            role="tooltip"
            menuRole="dialog"
          >
            <div>Test</div>
          </Popper>
        )
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
