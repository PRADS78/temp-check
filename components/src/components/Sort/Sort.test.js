import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Sort.stories";
import { SortOrder } from "../../Enums";

const { Standard, DefaultSelected } = composeStories(stories);

describe("Sort", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const sortButton = await screen.findAllByRole("button");
    expect(sortButton[0]).toHaveClass(ctrCls);
  });

  test("menuCtrCls must be applied", async () => {
    const menuCtrCls = "menu-container-class";
    await act(
      async () => await render(<DefaultSelected menuCtrCls={menuCtrCls} />)
    );
    const sortButton = screen.getAllByRole("button");
    fireEvent.click(sortButton[0]);
    const menu = await screen.findAllByRole("menu");
    expect(menu[1]).toHaveClass(menuCtrCls);
  });

  test("items must be rendered", async () => {
    const items = [
      {
        label: "Popularity",
        id: 1,
      },
    ];
    render(<DefaultSelected items={items} />);
    const sortButton = await screen.findAllByRole("button");
    fireEvent.click(sortButton[0]);
    const list = screen.getAllByRole("list");
    expect(list.length).toBe(items.length);
  });

  test("onSort must be invoked", async () => {
    const onSort = jest.fn();
    render(<DefaultSelected onSort={onSort} />);
    const sortButton = await screen.findAllByRole("button");
    fireEvent.click(sortButton[0]);
    const list = screen.getAllByRole("list");
    fireEvent.click(list[2]);
    expect(onSort).toHaveBeenCalled();
  });

  test("By-Order value must be applied", async () => {
    const by = "3";
    const order = SortOrder.ASCENDING;
    render(<Standard by={by} order={order} />);
    const sortButton = await screen.findAllByRole("button");
    fireEvent.click(sortButton[0]);
    const list = screen.getAllByRole("list");
    expect(list[2]).toHaveClass("selected");
  });
});
