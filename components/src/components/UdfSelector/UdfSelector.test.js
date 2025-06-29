import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./UdfSelector.stories";
import userEvent from "@testing-library/user-event";

const { Standard, DefaultSelected, WithEmptyUsersFilter } =
  composeStories(stories);

const NO_OF_UDF_ITEMS_RENDERED = 100;
const NO_OF_UDF_FIELDS_RENDERED = 3;

describe("UdfSelector", () => {
  test("component must be rendered", async () => {
    await act(async () => await render(<Standard />));
    const menu = screen.getAllByRole("menu");
    const leftMenu = menu[0];
    const rightMenu = menu[1];
    expect(leftMenu).toBeInTheDocument();
    expect(rightMenu).toBeInTheDocument();
  });

  test("rightdropdown should be disabled initially", async () => {
    await act(async () => await render(<Standard />));
    const menu = screen.getAllByRole("menu")[1];
    expect(menu).toHaveClass("disabled");
  });

  test("add icon must be rendered", async () => {
    await act(async () => await render(<Standard />));
    const addIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "add");
    expect(addIcon[0]).toBeInTheDocument();
  });

  test("remove icon must be rendered", async () => {
    await act(async () => await render(<Standard />));
    const removeIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "remove");
    expect(removeIcon[0]).toBeInTheDocument();
  });

  test("placeholder must be rendered", async () => {
    await act(async () => await render(<Standard />));
    const leftPlaceholderText = screen.getByText(
      Standard.args.leftDropDownCustomization.placeholder
    );
    const rightPlaceholderText = screen.getByText(
      Standard.args.rightDropDownCustomization.placeholder
    );
    expect(leftPlaceholderText).toBeInTheDocument();
    expect(rightPlaceholderText).toBeInTheDocument();
  });

  test("udf row rendered based on default value", async () => {
    await act(async () => await render(<DefaultSelected />));
    const expectedRender = DefaultSelected.args.defaultValues?.length
      ? DefaultSelected.args.defaultValues.length
      : 1;
    const menu = screen.getAllByRole("menu");
    expect(menu.length / 2).toBe(expectedRender);
  });

  test("udf value dropdown should not be disabled when udfvalue is selected", async () => {
    const selectedItemIndex = 0;
    await act(async () => await render(<Standard />));
    const leftMenu = screen.getAllByRole("menu")[0];
    fireEvent.click(leftMenu);
    const leftItems = screen.getAllByRole("option")[selectedItemIndex];
    fireEvent.click(leftItems);

    const menu = await screen.findAllByRole("menu");
    const rightMenu = menu[1];
    fireEvent.click(rightMenu);
    const rightItems = screen.getAllByRole("checkbox")[selectedItemIndex];
    fireEvent.click(rightItems);
    expect(rightMenu).not.toHaveClass("disabled");
  });

  test("check onAdd is triggered, when adding UDFvalues", async () => {
    const selectedItemIndex = 0;
    const onAdd = jest.fn();
    await act(async () => await render(<Standard onAdd={onAdd} />));
    const leftMenu = screen.getAllByRole("menu")[0];
    fireEvent.click(leftMenu);
    const leftItems = screen.getAllByRole("option")[selectedItemIndex];
    fireEvent.click(leftItems);

    const menu = await screen.findAllByRole("menu");
    const rightMenu = menu[1];
    fireEvent.click(rightMenu);
    const rightItems = screen.getAllByRole("checkbox")[selectedItemIndex];
    fireEvent.click(rightItems);
    expect(onAdd).toHaveBeenCalled();
  });

  test("check onRemove is triggered, when removing UDFvalues", async () => {
    const onRemove = jest.fn();
    await act(
      async () => await render(<DefaultSelected onRemove={onRemove} />)
    );
    const removeIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "remove");
    fireEvent.click(removeIcon[0]);
    expect(onRemove).toHaveBeenCalled();
  });

  test("click on the add button should render new UDF row", async () => {
    await act(async () => await render(<DefaultSelected />));
    const addIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "add");
    fireEvent.click(addIcon[0]);
    const rowRender = await screen.findAllByRole("menu");
    expect(rowRender.length / 2).toBe(
      DefaultSelected.args.defaultValues?.length + 1
    );
  });

  test("Add button should be disabled when last row is removed", async () => {
    await act(
      async () =>
        await render(
          <DefaultSelected
            defaultValues={[
              {
                udfFieldId: 2,
                udfFieldValues: [100],
              },
            ]}
          />
        )
    );
    const remove = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "remove");
    fireEvent.click(remove[0]);
    const addIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "add");
    expect(addIcon[0]).toBeDisabled();
  });

  test("Right dropdown should render correct values of left dropdown when it's changed", async () => {
    const selectedItemIndex = 1;
    const onAdd = jest.fn();
    await act(async () => await render(<DefaultSelected onAdd={onAdd} />));
    const leftMenu = screen.getAllByRole("menu")[0];
    fireEvent.click(leftMenu);
    const leftItems = screen.getAllByRole("option")[selectedItemIndex];
    fireEvent.click(leftItems);

    const menu = await screen.findAllByRole("menu");
    const rightMenu = menu[1];
    fireEvent.click(rightMenu);
    const rightItems = screen.getAllByRole("checkbox")[selectedItemIndex];
    fireEvent.click(rightItems);
    expect(onAdd).toHaveBeenCalled();
  });

  test("Right dropdown should hide udfs with zero users, if canHideUdfsWithZeroUsers prop is sent true", async () => {
    const selectedItemIndex = 1;
    await act(async () => await render(<WithEmptyUsersFilter />));
    const leftMenu = screen.getAllByRole("menu")[0];
    await userEvent.click(leftMenu);
    const leftItems = screen.getAllByRole("option")[selectedItemIndex];
    await userEvent.click(leftItems);

    const menu = await screen.findAllByRole("menu");
    const rightMenu = menu[1];
    await userEvent.click(rightMenu);
    const rightItems = screen.getAllByRole("checkbox");
    expect(rightItems).toHaveLength(NO_OF_UDF_ITEMS_RENDERED / 2);
  });

  test("Left dropdown should hide udfs when all values have zero users and canHideUdfsWithZeroUsers prop is sent true", async () => {
    await act(async () => await render(<WithEmptyUsersFilter />));
    const leftMenu = screen.getAllByRole("menu")[0];
    await userEvent.click(leftMenu);
    const leftItems = screen.getAllByRole("option");

    expect(leftItems).toHaveLength(NO_OF_UDF_FIELDS_RENDERED - 1);
  });

  test("To check udf limit exceeds add button should be disabled", async () => {
    await act(
      async () =>
        await render(
          <DefaultSelected
            defaultValues={[
              {
                udfFieldId: 2,
                udfFieldValues: [100],
              },
            ]}
            maxNoOfUdfToSelect={1}
          />
        )
    );
    const addIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "add");
    expect(addIcon[0]).toBeDisabled();
  });
});
