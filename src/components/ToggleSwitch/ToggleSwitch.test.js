import { composeStories } from "@storybook/testing-react";
import { fireEvent, render, screen } from "@testing-library/react";
import * as stories from "./ToggleSwitch.stories";
import { mockResizeObserver } from "jsdom-testing-mocks";
import { act } from "react-dom/test-utils";

const { Standard, Small, Disabled } = composeStories(stories);
const resizeObserver = mockResizeObserver();

describe("ToggleSwitch", () => {
  test("Component must be rendered", async () => {
    render(<Standard />);
    const switches = await screen.findAllByRole("tab");
    resizeObserver.mockElementSize(switches[0], {
      borderBoxSize: {
        blockSize: 40,
        inlineSize: 158.65625,
      },
      contentBoxSize: {
        blockSize: 20,
        inlineSize: 110.65625,
      },
    });
    act(() => {
      // on the first run you don't have to pass the element,
      // it will be included in the list of entries automatically
      // because of the call to .observe
      resizeObserver.resize();
    });
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  test("Small Component must be rendered", async () => {
    render(<Small />);
    const container = await screen.findByRole("tablist");
    expect(container).toHaveClass("small");
  });

  test("ctrCls must be applied", async () => {
    const customClass = "custom-class";
    render(<Standard ctrCls={customClass} />);
    expect(await screen.findByRole("tablist")).toHaveClass(customClass);
  });

  test("onChange must be triggered", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} />);
    const switches = await screen.findAllByRole("tab");
    fireEvent.click(switches[0]);
    expect(onChange).toBeCalled();
  });

  test("selectedId must be reflected", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} selectedId={2} />);
    const switches = await screen.findAllByRole("tab");
    expect(switches[1]).toHaveClass("active");
  });

  test("active item must be reflected", async () => {
    render(<Standard />);
    const switches = await screen.findAllByRole("tab");
    fireEvent.click(switches[1]);
    expect(switches[1]).toHaveClass("active");
  });

  test("must be disabled when isDisabled prop is set to the component", async () => {
    const onChange = jest.fn();
    render(<Disabled onChange={onChange} />);
    const switches = await screen.findAllByRole("tab");
    expect(switches[0]).toHaveClass("disabled");
    fireEvent.click(switches[0]);
    expect(onChange).not.toBeCalled();
    expect(switches[1]).toHaveClass("disabled");
    fireEvent.click(switches[1]);
    expect(onChange).not.toBeCalled();
  });

  test("must disable one item when isDisabled is set to the one item", async () => {
    const onChange = jest.fn();
    render(
      <Standard
        onChange={onChange}
        items={[
          {
            label: "Option 1",
            id: 1,
          },
          {
            label: "Long Option Here",
            id: 2,
            isDisabled: true,
          },
        ]}
      />
    );
    const switches = await screen.findAllByRole("tab");
    expect(switches[0]).not.toHaveClass("disabled");
    fireEvent.click(switches[0]);
    expect(onChange).toBeCalledTimes(1);
    expect(switches[1]).toHaveClass("disabled");
    fireEvent.click(switches[1]);
    expect(onChange).toBeCalledTimes(1);
  });
});
