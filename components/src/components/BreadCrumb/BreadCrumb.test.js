import { render, screen } from "test-utils";
import * as stories from "./BreadCrumb.stories";
import { composeStories } from "@storybook/testing-react";
import userEvent from "@testing-library/user-event";

const { Standard } = composeStories(stories);
describe("BreadCrumb", () => {
  test("HomeIcon should be rendered", async () => {
    await render(<Standard />);
    const homeFilledIcon = await screen.findByDzUniqueId(/.*svghome.*/);
    expect(homeFilledIcon).toBeInTheDocument();
  });

  test("label names should be rendered", async () => {
    render(<Standard />);
    await userEvent.click(await screen.findByText("Go to Screen 1"));

    expect(screen.getByText("Screen 1")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Go to Screen 2"));
    expect(screen.getByText("Screen 2")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Go to Screen 3"));
    expect(screen.getByText("Screen 3")).toBeInTheDocument();
  });

  test("arrow icons should be rendered", async () => {
    render(<Standard />);
    await userEvent.click(await screen.findByText("Go to Screen 1"));
    let arrowIcon = screen.getByDzUniqueId(/.*svgrightarrow.*/);
    expect(arrowIcon).toBeInTheDocument();
    await userEvent.click(screen.getByText("Go to Screen 2"));
    arrowIcon = screen.getAllByDzUniqueId(/.*svgrightarrow.*/);
    expect(arrowIcon).toHaveLength(2);
    await userEvent.click(screen.getByText("Go to Screen 3"));
    arrowIcon = screen.getAllByDzUniqueId(/.*svgrightarrow.*/);

    expect(arrowIcon).toHaveLength(3);
  });

  test("onClick should be invoked", async () => {
    const onHomeClickMockFn = jest.fn();
    const onClickMockFn = jest.fn();
    const testData = [
      {
        id: "screen1",
        label: "Screen 1",
        onClick: onClickMockFn,
      },
    ];
    render(<Standard testData={testData} onHomeClick={onHomeClickMockFn} />);
    await userEvent.click(await screen.findByText("Go to Screen 1"));
    await userEvent.click(screen.getByDzUniqueId(/.*svghome.*/));
    expect(onHomeClickMockFn).toHaveBeenCalled();
  });
});
