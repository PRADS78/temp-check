import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./CoachMark.stories";

const { Standard } = composeStories(stories);

describe("CoachMark", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("component must be rendered", async () => {
    render(<Standard {...Standard.args} />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const menu = screen.queryByRole("menu");
    expect(menu).not.toBeInTheDocument();
  });

  test("coachmark must be displayed", async () => {
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
  });

  test("header close button must be rendered", async () => {
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const headerCloseButton = screen.getByRole("dismissdialog");
    expect(headerCloseButton).toBeInTheDocument();
  });

  test("header image container must be rendered", async () => {
    const headerCtrCls = "headerContainer";
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const content = screen
      .getAllByRole("region")
      .find((el) => el.dataset.role === "coachmark-header-container");
    expect(content).toHaveClass(headerCtrCls);
  });

  test("content container must be rendered", async () => {
    const contentCtrCls = "contentContainer";
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const content = screen
      .getAllByRole("region")
      .find((el) => el.dataset.role === "coachmark-content-container");
    expect(content).toHaveClass(contentCtrCls);
  });

  test("navigation container must be rendered", async () => {
    const navigationCtrCls = "navigationContainer";
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const content = screen
      .getAllByRole("region")
      .find((el) => el.dataset.role === "coachmark-navigation-container");
    expect(content).toHaveClass(navigationCtrCls);
    const NextButton = screen.getByText("Next");
    expect(NextButton).toBeInTheDocument();
    const progressIndicator = screen
      .getAllByRole("region")
      .filter((el) => el.dataset.role === "coachmark-progress-indicator");
    expect(progressIndicator.length).toBe(3);
  });

  test("onNext button to render another coachlist", async () => {
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const NextButton = screen.getByText("Next");
    fireEvent.click(NextButton);
    const PreviousButton = screen.getByText("Previous");
    expect(PreviousButton).toBeInTheDocument();
    const NextButton1 = screen.getByText("Next");
    fireEvent.click(NextButton1);
    const DoneButton = screen.getByText("Done");
    expect(DoneButton).toBeInTheDocument();
    const progressIndicator = screen
      .getAllByRole("region")
      .filter((el) => el.dataset.role === "coachmark-progress-indicator");
    expect(progressIndicator[2]).toHaveClass("filled");
    fireEvent.click(PreviousButton);
    expect(progressIndicator[2]).not.toHaveClass("filled");
  });

  test("onclose button click must be invoked", async () => {
    const onDismissDialogBox = jest.fn();
    await act(
      async () =>
        await render(
          <Standard {...Standard.args} onDismiss={onDismissDialogBox} />
        )
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const dismissDialogButton = screen.getByRole("dismissdialog");
    fireEvent.click(dismissDialogButton);
    expect(onDismissDialogBox).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("onDone button click must be invoked", async () => {
    const onDoneClick = jest.fn();
    await act(
      async () =>
        await render(<Standard {...Standard.args} onDone={onDoneClick} />)
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const NextButton = screen.getByText("Next");
    fireEvent.click(NextButton);
    const DoneButton = screen.getByText("Done");
    expect(DoneButton).toBeInTheDocument();
    fireEvent.click(DoneButton);
    expect(onDoneClick).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("Don't show coachmark again must be checked", async () => {
    await act(async () => await render(<Standard {...Standard.args} />));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(
      async () => expect(await screen.findByRole("menu")).toBeInTheDocument(),
      {
        timeout: 3000,
      }
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
