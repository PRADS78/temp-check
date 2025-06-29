import { composeStories } from "@storybook/testing-react";
import { render, screen, fireEvent } from "test-utils";
import * as stories from "./Toggletip.stories";
import { mockResizeObserver } from "jsdom-testing-mocks";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

const { CustomContentOne, CustomContentTwo } = composeStories(stories);
const resizeObserver = mockResizeObserver();

describe("Toggletip", () => {
  test("component must be rendered", async () => {
    await render(<CustomContentOne {...CustomContentOne.args} />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("on click must render the toggletip", async () => {
    act(() => {
      resizeObserver.resize();
    });
    await render(<CustomContentOne {...CustomContentOne.args} />);
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  test("children must be rendered", async () => {
    act(() => {
      resizeObserver.resize();
    });
    await render(
      <CustomContentOne {...CustomContentOne.args}>
        {() => <span>Custom Content One</span>}
      </CustomContentOne>
    );
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(screen.getByText("Custom Content One")).toBeInTheDocument();
  });

  test("on click again must close the toggletip", async () => {
    act(() => {
      resizeObserver.resize();
    });
    await render(<CustomContentOne {...CustomContentOne.args} />);
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    fireEvent.click(button[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("on click outside must close the toggletip", async () => {
    act(() => {
      resizeObserver.resize();
    });
    await render(<CustomContentOne {...CustomContentOne.args} />);
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("toggletip-container"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("onClickOutside must be triggered", async () => {
    const _onClickOutside = jest.fn();
    act(() => {
      resizeObserver.resize();
    });
    await render(
      <CustomContentOne
        {...CustomContentOne.args}
        onClickOutside={_onClickOutside}
      />
    );
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("toggletip-container"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(_onClickOutside).toHaveBeenCalled();
  });

  test("onReferenceClick must be triggered", async () => {
    const _onReferenceClick = jest.fn();
    act(() => {
      resizeObserver.resize();
    });
    await render(
      <CustomContentOne
        {...CustomContentOne.args}
        onReferenceClick={_onReferenceClick}
      />
    );
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    fireEvent.click(infoButton[0]);
    expect(_onReferenceClick).toHaveBeenCalled();
  });

  test("imperative hide method should hide the toggle tip", async () => {
    act(() => {
      resizeObserver.resize();
    });
    await render(<CustomContentTwo {...CustomContentTwo.args} />);
    const button = await screen.findAllByRole("button");
    const infoButton = button.filter((btn) => btn.dataset.role === "info-icon");
    await userEvent.click(infoButton[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    const ignoreButton = screen.getByDzUniqueId("stories-1674055913973-button");
    await userEvent.click(ignoreButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
