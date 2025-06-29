import {
  act,
  render,
  fireEvent,
  screen,
  within,
  getByRole,
  waitFor,
  userEventPro,
} from "test-utils";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Table.stories";
import { Edit, Trash } from "@disprz/icons";
import { ButtonTypes, TableExpansionType } from "../../Enums";
import ErrorBoundary from "../../test-utils/ErrorBoundary";

const {
  Standard,
  WithSearch,
  DisableSpecificRowSelection,
  RowSelectionMulti,
  DefaultRowSelection,
  RowSelectionSingle,
  WithoutTotalCount,
  WithTableActions,
  ColumnClickable,
  ConditionalTableSelectActions,
  RowClickable,
  RowExpandable,
  TableSelectActionAsDropdownButton,
  TableWithFilter,
  TableWithFilterPreApplied,
  TableWithGlobalFilters,
  TableWithPreAppliedGlobalFilters,
  ConfigureEmptyRowMessage,
  EmptyRowMessage,
} = composeStories(stories);

describe("Table", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const onRenderer = jest.fn();
  const columns = [
    {
      canShowAvatar: true,
      id: "name",
      key: (row) => `${row.firstName} ${row.lastName}`,
      title: "Name",
      isSortable: false,
      ctrCls: "name",
      imageUrl: ({ row }) => row.imageUrl,
    },
    {
      key: "username",
      title: "Username",
      isSortable: true,
    },
    {
      key: "email",
      title: "Email",
    },
    { key: "gender", title: "Gender", isSortable: false },
    {
      key: "age",
      title: "Age",
      isSortable: false,
      onRenderer: onRenderer,
    },
  ];

  const sizeItems = [{ value: 5, label: "Items per page 5" }];

  describe("Table Basic", () => {
    test("title must be rendered", async () => {
      await act(async () => await render(<Standard columns={columns} />));
      const element = screen.getByText("List of Users");
      expect(element).toBeInTheDocument();
    });

    test("title must not be rendered", async () => {
      await act(
        async () => await render(<Standard columns={columns} title={""} />)
      );
      const element = screen.queryByText("List of Users");
      expect(element).not.toBeInTheDocument();
    });

    test("columns must be rendered", async () => {
      await act(async () => await render(<Standard columns={columns} />));
      const tableHeaders = screen.getAllByRole("columnheader");
      expect(tableHeaders.length).toBe(columns.length);
    });

    test("empty message must be rendered", async () => {
      const onAction = jest.fn();
      const emptyOptions = {
        message: "No results found!",
        actionText: "Clear All",
        onAction: onAction,
      };
      await act(
        async () =>
          await render(
            <EmptyRowMessage columns={columns} emptyOptions={emptyOptions} />
          )
      );
      const element = screen.queryByText("No results found!");
      const actionButton = screen.queryAllByRole("button");
      fireEvent.click(actionButton[3]);
      expect(element).toBeInTheDocument();
      expect(onAction).toHaveBeenCalled();
    });

    test("Configured empty message must be rendered", async () => {
      const emptyOptions = {
        onRenderer: () => {
          return <div>No rows Found!</div>;
        },
      };
      await act(
        async () =>
          await render(
            <ConfigureEmptyRowMessage
              columns={columns}
              emptyOptions={emptyOptions}
            />
          )
      );
      const element = screen.queryByText("No rows Found!");
      expect(onRenderer).toBeCalled();
      expect(element).toBeInTheDocument();
    });

    test("Default empty message must be rendered", async () => {
      await act(
        async () =>
          await render(
            <WithSearch
              columns={columns}
              searchOptions={{
                canShowSearch: true,
                value: "test",
              }}
            />
          )
      );
      const element = screen.queryByText("Sorry! No result found");
      expect(element).toBeInTheDocument();
    });

    test("canShowAction on emptyOptions must render the action button when it's true", async () => {
      const emptyOptions = {
        message: "No results found!",
        canShowAction: true,
        actionText: "Clear All",
      };
      await act(
        async () =>
          await render(
            <EmptyRowMessage columns={columns} emptyOptions={emptyOptions} />
          )
      );
      const emptyCell = screen.getByRole("cell");
      const clearAllButton = within(emptyCell).getByRole("button");
      expect(clearAllButton).toBeInTheDocument();
    });

    test("canShowAction on emptyOptions must not render the action button when it's false", async () => {
      const emptyOptions = {
        message: "No results found!",
        canShowAction: false,
      };
      await act(
        async () =>
          await render(
            <EmptyRowMessage columns={columns} emptyOptions={emptyOptions} />
          )
      );
      const emptyCell = screen.getByRole("cell");
      const clearAllButton = within(emptyCell).queryByRole("button");
      expect(clearAllButton).not.toBeInTheDocument();
    });

    test("throw error when id is not provided when a column key is function", async () => {
      const errorColumns = columns.concat({
        key: () => `invalid-column`,
        title: "Invalid column",
      });

      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        await render(
          //ErrorBoundary is added to catch the errors thrown by invariant and to be able to assert the error
          <ErrorBoundary>
            <Standard {...Standard.args} columns={errorColumns} />
          </ErrorBoundary>
        );
      });
      const errorMsg = await screen.findByText(
        /Required id for a column, if key is a function/
      );
      expect(errorMsg).toBeInTheDocument();
    });

    test("onRenderer for columns should be invoked", async () => {
      await act(async () => await render(<Standard columns={columns} />));
      expect(onRenderer).toBeCalled();
    });

    test("isClickable for a column must render hyperlink button when isClickable is either func/bool", async () => {
      await act(async () => await render(<ColumnClickable />));
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      const buttons = within(firstRow).getAllByRole("button");
      const userNameButton = buttons[0];
      const emailButton = buttons[1];
      expect(userNameButton).toHaveClass("clickableCell");
      expect(emailButton).toHaveClass("clickableCell");
    });

    test("isClickable must render hyperlink button", async () => {
      await act(async () => await render(<ColumnClickable />));
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      const button = within(firstRow).getAllByRole("button");
      expect(button[0]).toHaveClass("clickableCell");
    });

    test("onRowClickable must be invoked when isRowClickable returns true", async () => {
      const onRowClick = jest.fn();
      await act(
        async () => await render(<RowClickable onRowClick={onRowClick} />)
      );
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      firstRow.click(firstRow);
      expect(firstRow).toHaveClass("clickableRow");
      expect(onRowClick).toBeCalled();
      // const button = within(firstRow).getAllByRole("button");
      // expect(button[0]).toHaveClass("clickableCell");
    });

    test("onRowClickable must be invoked when isRowClickable is function returning true", async () => {
      const onRowClick = jest.fn();
      await act(
        async () =>
          await render(
            <RowClickable
              onRowClick={onRowClick}
              isRowClickable={() => {
                return true;
              }}
            />
          )
      );
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      firstRow.click(firstRow);
      expect(firstRow).toHaveClass("clickableRow");
      expect(onRowClick).toBeCalled();
      // const button = within(firstRow).getAllByRole("button");
      // expect(button[0]).toHaveClass("clickableCell");
    });

    test("onClick must be invoked when clicking a hyperlink button", async () => {
      const onClick = jest.fn();
      const filteredColumns = ColumnClickable.args.columns.filter((column) => {
        return column.key !== "username";
      });
      await act(
        async () =>
          await render(
            <ColumnClickable
              columns={[
                ...filteredColumns,
                {
                  key: "username",
                  title: "Username",
                  isSortable: true,
                  isClickable: ({ index }) => {
                    return index % 2 === 0;
                  },
                  onClick: onClick,
                },
              ]}
            />
          )
      );
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      const button = within(firstRow).getAllByRole("button");
      fireEvent.click(button[1]);
      expect(onClick).toBeCalled();
    });

    test("canShowAvatar must render avatar", async () => {
      await act(async () => await render(<Standard columns={columns} />));
      const firstRow = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row")
        .filter((_, index) => index === 0)[0];
      const avatar = within(firstRow).getAllByRole("img");
      expect(avatar.length).toBe(1);
    });
  });

  describe("Table Pagination", () => {
    test("page size options must be rendered", async () => {
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 10,
                sizeItems,
              }}
              columns={columns}
            />
          )
      );
      const pageSizeOptions = screen.getAllByRole("menu")[0];
      fireEvent.click(pageSizeOptions);
      const options = screen.getAllByRole("option");
      expect(options.length).toBe(sizeItems.length);
    });

    test("onSizeChange must be invoked", async () => {
      const onSizeChange = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 10,
                sizeItems,
                onSizeChange,
              }}
              columns={columns}
            />
          )
      );
      const pageSizeOptions = screen.getAllByRole("menu")[0];
      fireEvent.click(pageSizeOptions);
      const options = screen.getAllByRole("option");
      fireEvent.click(options[0]);
      expect(onSizeChange).toBeCalled();
    });

    test("onSet must be invoked", async () => {
      const onSet = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 5,
                sizeItems,
                onSet,
              }}
              columns={columns}
            />
          )
      );
      const pageOptions = screen.getAllByRole("menu")[1];
      fireEvent.click(pageOptions);
      const options = screen.getAllByRole("option");
      fireEvent.click(options[1]);
      expect(onSet).toBeCalled();
    });

    test("onSet must not be invoked when selecting same page", async () => {
      const onSet = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 5,
                sizeItems,
                onSet,
              }}
              columns={columns}
            />
          )
      );
      const pageOptions = screen.getAllByRole("menu")[1];
      fireEvent.click(pageOptions);
      const options = screen.getAllByRole("option");
      fireEvent.click(options[0]);
      expect(onSet).not.toBeCalled();
    });

    test("onNext must be invoked", async () => {
      // Can we test next page data also with this?
      const onNext = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 5,
                onNext,
              }}
              columns={columns}
            />
          )
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[buttons.length - 1]); //Assumption this is a last button
      expect(onNext).toHaveBeenCalled();
    });

    test("onNext must not be invoked on last page", async () => {
      // Can we test next page data also with this?
      const onNext = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 890,
                limit: 10,
                onNext,
              }}
              columns={columns}
            />
          )
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[buttons.length - 1]); //Assumption this is a last button
      expect(buttons[buttons.length - 1]).toBeDisabled();
      expect(onNext).not.toHaveBeenCalled();
    });

    test("onPrevious must be invoked", async () => {
      const onPrevious = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 5,
                limit: 5,
                onPrevious,
              }}
              columns={columns}
            />
          )
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[buttons.length - 2]); //Assumption this is a second last button
      expect(onPrevious).toHaveBeenCalled();
    });

    test("onPrevious must not be invoked on first page", async () => {
      const onPrevious = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit: 10,
                onPrevious,
              }}
              columns={columns}
            />
          )
      );
      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[buttons.length - 2]); //Assumption this is a second last button
      expect(buttons[buttons.length - 2]).toBeDisabled();
      expect(onPrevious).not.toHaveBeenCalled();
    });

    test("number of rows must be rendered and match the take count", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset: 0,
                limit,
              }}
              columns={columns}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      expect(tbodyRows.length).toBe(limit);
    });

    test("skip count must reflect the appropriate page number", async () => {
      const offset = 10,
        limit = 10;
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset,
                limit,
              }}
              columns={columns}
            />
          )
      );
      const pageOptions = screen.getAllByRole("menu")[1];
      expect(pageOptions).toHaveTextContent(offset / limit + 1);
    });

    test("page size multiplier must be reflected ", async () => {
      const offset = 0,
        limit = 20,
        sizeMultiplier = 20;
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset,
                limit,
                sizeMultiplier,
              }}
              columns={columns}
            />
          )
      );
      const pageOptions = screen.getAllByRole("menu")[0];
      expect(pageOptions).toHaveTextContent(sizeMultiplier);
    });

    test("no of page size items must be reflected ", async () => {
      const offset = 0,
        limit = 5,
        sizeMultiplier = 5,
        noOfSizeItems = 2;
      await act(
        async () =>
          await render(
            <Standard
              pageOptions={{
                offset,
                limit,
                sizeMultiplier,
                noOfSizeItems,
              }}
              columns={columns}
            />
          )
      );
      const pageOptions = screen.getAllByRole("menu")[0];
      fireEvent.click(pageOptions);
      expect(within(pageOptions).getAllByRole("option").length).toBe(
        noOfSizeItems
      );
    });
  });

  describe("Table Sort", () => {
    test("onChange of sortOptions must be invoked", async () => {
      const onSortChange = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              columns={columns}
              sortOptions={{
                onChange: onSortChange,
              }}
            />
          )
      );
      const firstSortIcon = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "sort-icon";
      });
      fireEvent.click(firstSortIcon[0]);
      expect(onSortChange).toBeCalled();
    });

    test("onChange of sortOptions must be invoked when already sorted in asc", async () => {
      const onSortChange = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              columns={columns}
              sortOptions={{
                by: "username",
                order: "asc",
                onChange: onSortChange,
              }}
            />
          )
      );
      const firstSortIcon = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "sort-icon";
      });
      fireEvent.click(firstSortIcon[0]);
      expect(onSortChange).toBeCalled();
    });

    test("onChange of sortOptions must be invoked when already sorted in desc", async () => {
      const onSortChange = jest.fn();
      await act(
        async () =>
          await render(
            <Standard
              columns={columns}
              sortOptions={{
                by: "username",
                order: "desc",
                onChange: onSortChange,
              }}
            />
          )
      );
      const firstSortIcon = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "sort-icon";
      });
      fireEvent.click(firstSortIcon[0]);
      expect(onSortChange).toBeCalled();
    });
  });

  describe("Table Search ", () => {
    test("Search must be rendered when enabled", async () => {
      const onChange = jest.fn();
      await act(
        async () =>
          await render(
            <WithSearch
              columns={columns}
              searchOptions={{
                canShowSearch: true,
                value: "",
                onChange: onChange,
              }}
            />
          )
      );
      const inputElement = screen.getByRole("textbox");
      expect(inputElement).toBeInTheDocument();
    });

    test("Search must not be rendered when disabled", async () => {
      const onChange = jest.fn();
      await act(
        async () =>
          await render(
            <WithSearch
              columns={columns}
              searchOptions={{
                canShowSearch: false,
                value: "",
                onChange: onChange,
              }}
            />
          )
      );
      const inputElement = screen.queryByRole("textbox");
      expect(inputElement).not.toBeInTheDocument();
    });

    test("onSearchChange must be invoked", async () => {
      const onChange = jest.fn();
      await act(
        async () =>
          await render(
            <WithSearch
              columns={columns}
              searchOptions={{
                canShowSearch: true,
                value: "",
                onChange: onChange,
              }}
            />
          )
      );
      const inputElement = screen.getByRole("textbox");
      fireEvent.change(inputElement, { target: { value: "strawberry" } });
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Table Selection", () => {
    const actionCall = jest.fn();
    const actions = [
      {
        label: "Edit User",
        icon: () => {
          return <Edit className="fill" canRenderOnlyIcon />;
        },
        value: 0,
        onClick: () => {},
      },
      {
        label: "Delete User",
        value: 1,
        onClick: () => {},
        icon: () => {
          return <Trash className="fill" canRenderOnlyIcon />;
        },
      },
      {
        label: "Make Active",
        value: 2,
        onClick: () => {},
      },
      {
        label: "Make Inactive",
        value: 3,
        onClick: () => {},
      },
      {
        label: "Send email",
        value: 4,
        onClick: actionCall,
      },
    ];
    test("canEnableRowSelection must render selection checkbox", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      expect(checkBoxes[0]).toBeInTheDocument();
    });

    test("canEnableRowSelection must not render selection checkbox", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                canEnableRowSelection: false,
              }}
            />
          )
      );
      const checkBoxes = screen.queryByRole("checkbox");
      expect(checkBoxes).not.toBeInTheDocument();
    });

    test("canEnableRowSelection must render check box for all rows and header", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      expect(checkBoxes.length).toBe(limit + 1);
    });

    test("onRowSelect must be invoked for row select", async () => {
      const onRowSelect = jest.fn();
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
              }}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[0]);
      expect(onRowSelect).toBeCalled();
    });

    test("onRowSelect must be invoked for checkbox select", async () => {
      const onRowSelect = jest.fn();
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
              }}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      expect(onRowSelect).toBeCalled();
    });

    test("canEnableMultiRowSelection must allow to select multiple checkbox when true", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      fireEvent.click(checkBoxes[2]);
      expect(checkBoxes[1]).toBeChecked();
      expect(checkBoxes[2]).toBeChecked();
    });

    test("canEnableMultiRowSelection must disallow to select multiple checkbox when false", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionSingle
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      expect(checkBoxes[1]).toBeChecked();
      fireEvent.click(checkBoxes[2]);
      expect(checkBoxes[2]).toBeChecked();
      expect(checkBoxes[1]).not.toBeChecked();
    });

    test("canEnableAllPageRowsSelection must be hidden when false", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                canEnableAllPageRowsSelection: false,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("button");
      fireEvent.click(checkBox[1]);
      const menuComponent = screen.getAllByRole("listitem");
      expect(menuComponent.length).toBe(2);
    });

    test("canEnableAllPageRowsSelection must be visible when true", async () => {
      const limit = 5;
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              pageOptions={{
                ...RowSelectionMulti.args.pageOptions,
                limit,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("button");
      fireEvent.click(checkBox[1]);
      const menuComponent = screen.getAllByRole("listitem");
      expect(menuComponent.length).toBe(3);
    });

    test("onRowIdExtractor must be invoked if it's function", async () => {
      const onRowIdExtractor = jest.fn();
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowIdExtractor: onRowIdExtractor,
              }}
            />
          )
      );
      expect(onRowIdExtractor).toBeCalled();
    });

    test("canSelectByClickingFullRow must allow us to select only via checkbox when false", async () => {
      const onRowSelect = jest.fn();
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
                canSelectByClickingFullRow: false,
              }}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[1]);
      expect(onRowSelect).not.toBeCalled();
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      expect(onRowSelect).toBeCalled();
    });

    test("isRowSelectable and canSelectByClickingFullRow must not enable row click", async () => {
      const onRowClick = jest.fn(),
        onRowSelect = jest.fn();
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
              }}
              isRowClickable
              onRowClick={onRowClick}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[0]);
      expect(onRowSelect).toBeCalled();
      expect(onRowClick).not.toBeCalled();
    });

    test("canSelectByClickingFullRow disabled must enable row click when isRowClickable is true", async () => {
      const onRowClick = jest.fn(),
        onRowSelect = jest.fn();
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
                canSelectByClickingFullRow: false,
              }}
              isRowClickable
              onRowClick={onRowClick}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[0]);
      expect(onRowSelect).not.toBeCalled();
      expect(onRowClick).toBeCalled();
    });

    test("canEnableRowSelection must allow to disable particular row selection via full row click and checkbox.", async () => {
      const onRowClick = jest.fn(),
        onRowSelect = jest.fn();
      await act(
        async () =>
          await render(
            <DisableSpecificRowSelection
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
                canEnableRowSelection: ({ index }) => index !== 1,
              }}
              isRowClickable
              onRowClick={onRowClick}
            />
          )
      );

      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[1]);
      expect(onRowSelect).not.toBeCalled();
      expect(onRowClick).toBeCalled();

      const checkBoxes = screen.getAllByRole("checkbox");
      expect(checkBoxes[2]).toBeDisabled();
      expect(checkBoxes[2]).not.toBeChecked();

      fireEvent.click(checkBoxes[2]);
      expect(onRowSelect).not.toBeCalled();
      expect(checkBoxes[2]).not.toBeChecked();
    });

    test("canEnableRowSelection must not allow deselect particular selected row via clicking on checkbox.", async () => {
      const onRowClick = jest.fn(),
        onRowSelect = jest.fn(),
        onRowIdExtractor = ({ index }) => {
          return index;
        };
      await act(
        async () =>
          await render(
            <DisableSpecificRowSelection
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowIdExtractor,
                onRowSelect: onRowSelect,
                canEnableRowSelection: ({ index }) => index !== 2,
                defaultSelectedRowIds: [2],
              }}
              isRowClickable
              onRowClick={onRowClick}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      expect(checkBoxes[3]).toBeDisabled();
      expect(checkBoxes[3]).toBeChecked();

      fireEvent.click(checkBoxes[3]);
      expect(onRowClick).not.toBeCalled();
      expect(onRowSelect).not.toBeCalled();
      expect(checkBoxes[3]).toBeChecked();
    });

    test("onRowClickable must not be called when isRowClickable is false", async () => {
      const onRowClick = jest.fn(),
        onRowSelect = jest.fn();
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowSelect: onRowSelect,
                canSelectByClickingFullRow: false,
              }}
              isRowClickable={false}
              onRowClick={onRowClick}
            />
          )
      );
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      fireEvent.click(tbodyRows[0]);
      expect(onRowSelect).not.toBeCalled();
      expect(onRowClick).not.toBeCalled();
    });

    test("actions must be rendered when selected ", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
              searchOptions={{
                canEnableSearch: false,
                value: "",
              }}
              title=""
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButton = within(controls).getByText("Edit User");
      expect(actionButton).toBeInTheDocument();
      // expect(actionButtons.length - 1).toBe(actions.length); //Ignoring icon
    });

    test("max of 4 actions must only be rendered", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButtons = within(controls).getAllByRole("button");
      expect(actionButtons.length - 1).toBe(actions.length - 1);
    });

    test("after 4 actions must be rendered inside an menu", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButtons = within(controls).getAllByRole("button");
      fireEvent.click(actionButtons[actionButtons.length - 1]);
      const hiddenOptions = within(controls).getAllByRole("listitem");
      fireEvent.click(hiddenOptions[0]);
      expect(actionCall).toBeCalled();
      expect(hiddenOptions.length).toBe(actions.length - 4);
    });

    test("action must hide according to the canShow method", async () => {
      const showActionOnlyOnFirstIndex = jest.fn(({ selectedRows }) => {
        return selectedRows.every((row, index) => index === 0);
      });

      const actions = [
        {
          label: "First user only option",
          value: 0,
          onClick: () => {},
          canShow: showActionOnlyOnFirstIndex,
        },
        {
          label: "All option",
          value: 1,
          onClick: () => {},
          icon: () => {
            return <Trash className="fill" canRenderOnlyIcon />;
          },
        },
      ];
      await act(
        async () =>
          await render(
            <ConditionalTableSelectActions
              selectOptions={{
                ...ConditionalTableSelectActions.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButtons = within(controls).getAllByRole("button");
      expect(actionButtons.length).toBe(actions.length);
      fireEvent.click(checkBoxes[2]);
      const hiddenActions = within(controls).getAllByRole("button");
      expect(hiddenActions.length).toBe(actions.length - 1);
    });

    test("onSelectAllPageRows must be invoked", async () => {
      const onSelectAllPageRows = jest.fn(async () => {
        return await {
          rowIds: ["test"],
          rows: [
            {
              name: "test",
            },
          ],
        };
      });
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onSelectAllPageRows: onSelectAllPageRows,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("button");
      fireEvent.click(checkBox[1]);
      const menuComponent = screen.getAllByRole("listitem");
      await act(async () => {
        return await fireEvent.click(menuComponent[1]);
      });
      expect(onSelectAllPageRows).toBeCalled();
    });

    test("select current page must select all rows in page", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("button");
      fireEvent.click(checkBox[1]);
      const menuComponent = screen.getAllByRole("listitem");
      fireEvent.click(menuComponent[0]);
      const checkBoxes = screen.getAllByRole("checkbox");
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      expect(checkBoxes.length).toBe(tbodyRows.length + 1); // Header
      checkBoxes.forEach((checkBox) => {
        expect(checkBox).toBeChecked();
      });
    });

    test("deselect all must deselect all the rows", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("button");
      fireEvent.click(checkBox[1]);
      const menuComponent = screen.getAllByRole("listitem");
      fireEvent.click(menuComponent[2]);
      const checkBoxes = screen.getAllByRole("checkbox");
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      expect(checkBoxes.length).toBe(tbodyRows.length + 1); // Header
      checkBoxes.forEach((checkBox) => {
        expect(checkBox).not.toBeChecked();
      });
    });

    test("select all checkbox must be select all rows", async () => {
      await act(
        async () =>
          await render(
            <RowSelectionMulti
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const tableHead = screen.getAllByRole("columnheader");
      const checkBox = within(tableHead[0]).getAllByRole("checkbox");
      fireEvent.click(checkBox[0]);
      const checkBoxes = screen.getAllByRole("checkbox");
      const tbodyRows = screen
        .getAllByRole("row")
        .filter((el) => el.dataset.role === "tbody-row");
      expect(checkBoxes.length).toBe(tbodyRows.length + 1); // Header
      checkBoxes.forEach((checkBox) => {
        expect(checkBox).toBeChecked();
      });
    });

    test("providing defaultSelectedRowIds must select given rows by default", async () => {
      const defaultSelectedRowIds = [1, 2];
      const onRowIdExtractor = ({ index }) => {
        return index;
      };
      await act(
        async () =>
          await render(
            <DefaultRowSelection
              columns={columns}
              selectOptions={{
                ...RowSelectionMulti.args.selectOptions,
                onRowIdExtractor,
                defaultSelectedRowIds,
                defaultSelectedRows: [],
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox", { checked: true });
      expect(checkBoxes?.length).toEqual(defaultSelectedRowIds?.length);
    });

    test("select action button must render as dropdown button", async () => {
      const actions = [
        {
          label: "Change Evaluator",
          value: 0,
          onClick: () => {},
          type: ButtonTypes.DROP_DOWN,
          menuItems: [
            {
              id: 1,
              label: "Reporting Manager",
            },
            {
              id: 2,
              label: "Buddy",
            },
            {
              id: 3,
              label: "Specific People",
            },
          ],
          onMenuItemClick: () => {},
        },
      ];
      await act(
        async () =>
          await render(
            <TableSelectActionAsDropdownButton
              selectOptions={{
                ...ConditionalTableSelectActions.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButton = within(controls).getAllByRole("button")[0];
      expect(actionButton).toHaveClass("dropdownButtonCtr");
    });

    test("select action button must render as plain button", async () => {
      const actions = [
        {
          label: "Remove",
          value: 0,
          onClick: () => {},
          type: ButtonTypes.PLAIN,
        },
      ];
      await act(
        async () =>
          await render(
            <TableSelectActionAsDropdownButton
              selectOptions={{
                ...ConditionalTableSelectActions.args.selectOptions,
                actions,
              }}
            />
          )
      );
      const checkBoxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkBoxes[1]);
      const controls = screen.getByTestId("selection-controls");
      const actionButton = within(controls).getAllByRole("button")[0];
      expect(actionButton).toHaveClass("actionButtonCtr");
    });
  });

  describe("Table Shadow on Header and footer", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test("shadow class must reflect during scroll", async () => {
      await act(async () => await render(<Standard columns={columns} />));
      const innerScrollableContent = screen.getByTestId(
        "table-scrollable-content"
      );

      /**
       * As there is no height calculation done in jsdom,
       * we're mocking the scrollTop to fake scroll
       * and validating the class list
       */

      const header = screen.getAllByRole("rowgroup")[0];
      expect(header).not.toHaveClass("headerShadow");

      // This is scrolled to the bottom of the table
      fireEvent.scroll(innerScrollableContent, {
        target: {
          scrollTop: 100,
        },
      });
      expect(header).toHaveClass("headerShadow");

      // This is scrolled to the center of the table
      fireEvent.scroll(innerScrollableContent, {
        target: {
          scrollTop: -20,
        },
      });
      const paginationContainer = screen.getByTestId("pagination-container");
      expect(paginationContainer).toHaveClass("addShadow");

      // This is scrolled to the top of the table
      fireEvent.scroll(innerScrollableContent, {
        target: {
          scrollTop: 0,
        },
      });
      expect(header).not.toHaveClass("headerShadow");
    });
  });

  describe("Table without total count", () => {
    test("page navigation must not be rendered", async () => {
      await act(
        async () => await render(<WithoutTotalCount columns={columns} />)
      );
      const pageNavigationDropdown = screen.queryByTestId("page-navigator");
      expect(pageNavigationDropdown).not.toBeInTheDocument();
    });

    test("end of the list must disable the next page button", async () => {
      await act(
        async () =>
          await render(
            <WithoutTotalCount
              columns={columns}
              pageOptions={{
                ...WithoutTotalCount.args.pageOptions,
                limit: 10,
                offset: 890,
              }}
            />
          )
      );
      const paginationDropdown = screen.getByTestId("pagination-container");
      const paginationNavigationButtons =
        within(paginationDropdown).getAllByRole("button");
      expect(paginationNavigationButtons[2]).toBeDisabled();
    });
  });

  describe("Table with actions", () => {
    test("primary action must be rendered", async () => {
      await act(
        async () => await render(<WithTableActions columns={columns} />)
      );
      const tableControls = screen.getByTestId("table-controls");
      const actions = within(tableControls).getAllByRole("button");
      expect(actions[0]).toBeInTheDocument();
    });

    test("other action must be rendered", async () => {
      await act(
        async () => await render(<WithTableActions columns={columns} />)
      );
      const tableControls = screen.getByTestId("table-controls");
      const actions = within(tableControls).getAllByRole("button");
      fireEvent.click(actions[1]);
      const menuItems = within(tableControls).getAllByRole("listitem");
      expect(menuItems.length).toBe(WithTableActions.args.actions.length - 1); // Ignoring Primary action
    });
  });

  describe("Table with Filter", () => {
    describe("Table with Column Filter", () => {
      test("filter icon must not be rendered if when canEnableFilter or canEnableColumnFilter is disabled", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  canEnableFilter: false,
                }}
              />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        expect(filterButtons.length).toBe(0);

        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  canEnableColumnFilter: false,
                }}
              />
            )
        );
        expect(
          screen.getAllByRole("button").filter((button) => {
            return button.dataset.role === "filter-icon";
          }).length
        ).toBe(0);
      });

      test("filter must be rendered", async () => {
        const filterableColumns = TableWithFilter.args.columns.filter(
          (column) => {
            return column.isFilterable;
          }
        );

        await act(
          async () =>
            await render(<TableWithFilter {...TableWithFilter.args} />)
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        expect(filterButtons.length).toBe(filterableColumns.length);
      });

      test("onApply must be invoked with filter detail changes for List", async () => {
        const filterableColumns = TableWithFilter.args.columns.filter(
          (column) => {
            return column.isFilterable;
          }
        );
        const onApply = jest.fn();
        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  onApply: onApply,
                }}
              />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        fireEvent.click(filterButtons[0]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();

        const radioBtns = within(filterMenu).getAllByRole("radio");
        fireEvent.click(radioBtns[0]);
        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });
        const applyButton = within(footer[0]).getAllByRole("button")[1];
        fireEvent.click(applyButton);
        expect(onApply).toHaveBeenCalled();
        expect(onApply).toHaveBeenCalledWith({
          columnFilters: {
            [filterableColumns[0].key]: {
              [TableWithFilter.args.filterOptions.columnFilters.items[
                filterableColumns[0].key
              ].options[0].value]: true,
            },
          },
          globalFilters: {},
        });
      });

      test("onApply must be invoked with filter details change for DateRange", async () => {
        const onApply = jest.fn();

        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  onApply: onApply,
                }}
              />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });

        fireEvent.click(filterButtons[1]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();

        const today = new Date(new Date());
        const tomorrow = new Date(new Date().setDate(today.getDate() + 1));

        const isDifferentMonth = today.getMonth() !== tomorrow.getMonth();
        const startDate = within(filterMenu)
          .getAllByText(today.getDate())
          .filter((date) => {
            return !date.className.includes(
              "react-datepicker__day--outside-month"
            ); // TODO: Find a better way to do this
          })[0];

        await fireEvent.click(startDate);

        let endDates = within(filterMenu)
          .getAllByText(tomorrow.getDate())
          .filter((date) => {
            return !date.className.includes(
              "react-datepicker__day--outside-month"
            ); // TODO: Find a better way to do this
          });
        const endDate = isDifferentMonth ? endDates[1] : endDates[0];
        await fireEvent.click(endDate);

        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });

        const applyButton = within(footer[0]).getAllByRole("button")[1];
        await waitFor(() => expect(applyButton).toBeEnabled(), {
          timeout: 3000,
        });
        fireEvent.click(applyButton);
        await waitFor(() => expect(onApply).toHaveBeenCalled(), {
          timeout: 3000,
        });
      });

      test("onApply must be invoked with filter detail changes for Number Range", async () => {
        const filterableColumns = TableWithFilter.args.columns.filter(
          (column) => {
            return column.isFilterable;
          }
        );
        const onApply = jest.fn();
        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  onApply: onApply,
                }}
              />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        fireEvent.click(filterButtons[2]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();

        const textBoxes = within(filterMenu).getAllByRole("textbox");
        fireEvent.change(textBoxes[0], { target: { value: "10" } });
        fireEvent.change(textBoxes[1], { target: { value: "20" } });

        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });
        const applyButton = within(footer[0]).getAllByRole("button")[1];
        fireEvent.click(applyButton);
        expect(onApply).toHaveBeenCalled();
        expect(onApply).toHaveBeenCalledWith({
          columnFilters: {
            [filterableColumns[2].id]: [10, 20],
          },
          globalFilters: {},
        });
      });

      test("filter icon must not be rendered if the column is not filterable", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilter
                {...TableWithFilter.args}
                columns={[
                  {
                    ...TableWithFilter.args.columns[0],
                    isFilterable: false,
                  },
                ]}
              />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        expect(filterButtons.length).toBe(0);
      });

      test("must throw an error when filter data is not available with column set as isFilterable", async () => {
        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
          await render(
            <ErrorBoundary>
              <TableWithFilter
                {...TableWithFilter.args}
                columns={[
                  {
                    key: "name",
                    title: "Name",
                    isSortable: true,
                    isFilterable: true,
                  },
                ]}
                filterOptions={{
                  ...TableWithFilter.args.filterOptions,
                  columnFilters: undefined,
                }}
              />
            </ErrorBoundary>
          );
        });
        const errorMsg = await screen.findByText(
          /Filter data is not provided for the column "name"/
        );
        expect(errorMsg).toBeInTheDocument();
      });

      test("onCancel must be invoked when clicked outside", async () => {
        await act(
          async () =>
            await render(<TableWithFilter {...TableWithFilter.args} />)
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        fireEvent.click(filterButtons[0]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();
        fireEvent.click(document.body);
        expect(filterMenu).not.toBeInTheDocument();
      });

      test("pre selected filters must be applied", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilterPreApplied {...TableWithFilterPreApplied.args} />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        fireEvent.click(filterButtons[0]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();

        const radioBtns = within(filterMenu).getAllByRole("radio");
        expect(radioBtns[1].checked).toBe(true);
        expect(radioBtns[0].checked).toBe(false);
      });

      test("clear filter must render badge near filter icon for list", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilterPreApplied {...TableWithFilterPreApplied.args} />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        const header = screen.getAllByRole("rowheader");
        const badge = within(header[3]).getByRole("status");
        expect(badge).toBeInTheDocument();
        fireEvent.click(filterButtons[0]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();

        const radioBtns = within(filterMenu).getAllByRole("radio");
        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });
        const clearAllButton = within(footer[0]).getAllByRole("button")[0];
        fireEvent.click(clearAllButton);
        expect(radioBtns[1].checked).toBe(false);
        expect(radioBtns[0].checked).toBe(false);
        const applyButton = within(footer[0]).getAllByRole("button")[1];
        fireEvent.click(applyButton);
        expect(badge).not.toBeInTheDocument();
      });

      test("clear filter must render badge near filter icon for date range", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilterPreApplied {...TableWithFilterPreApplied.args} />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        const header = screen.getAllByRole("rowheader");
        const badge = within(header[4]).getByRole("status");
        expect(badge).toBeInTheDocument();
        fireEvent.click(filterButtons[1]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();
        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });
        const clearAllButton = within(footer[0]).getAllByRole("button")[0];
        fireEvent.click(clearAllButton);
        const applyButton = within(footer[0]).getAllByRole("button")[1];
        fireEvent.click(applyButton);
        expect(badge).not.toBeInTheDocument();
      });

      test("clear filter must render badge near filter icon for number range", async () => {
        await act(
          async () =>
            await render(
              <TableWithFilterPreApplied {...TableWithFilterPreApplied.args} />
            )
        );
        const filterButtons = screen.getAllByRole("button").filter((button) => {
          return button.dataset.role === "filter-icon";
        });
        const header = screen.getAllByRole("rowheader");
        const badge = within(header[5]).getByRole("status");
        expect(badge).toBeInTheDocument();
        fireEvent.click(filterButtons[2]);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const filterMenu = getByRole(
          // eslint-disable-next-line testing-library/no-node-access
          document.getElementById("disprz-popper"),
          "menu"
        );
        expect(filterMenu).toBeInTheDocument();
        const footer = within(filterMenu)
          .getAllByRole("region")
          .filter((region) => {
            return region.dataset.role === "filter-footer";
          });
        const clearAllButton = within(footer[0]).getAllByRole("button")[0];
        fireEvent.click(clearAllButton);
        const applyButton = within(footer[0]).getAllByRole("button")[1];
        fireEvent.click(applyButton);
        expect(badge).not.toBeInTheDocument();
      });
    });

    describe("Table with Global Filter", () => {
      // Skipping it, because Table doesn't offer individual apply buttons for now
      describe.skip("With discrete apply buttons", () => {
        test("onApply should be invoked when applying global filters", async () => {
          const globalFilters = Object.entries(
            TableWithGlobalFilters.args.filterOptions.globalFilters.items
          );
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters
                  {...TableWithGlobalFilters.args}
                  filterOptions={{
                    ...TableWithGlobalFilters.args.filterOptions,
                    onApply: onApply,
                  }}
                />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          fireEvent.click(pinnedGlobalFilterButtons[0]);
          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();
          const checkboxes = within(filterMenu).getAllByRole("checkbox");
          fireEvent.click(checkboxes[0]);
          const footer = within(filterMenu)
            .getAllByRole("region")
            .filter((region) => {
              return region.dataset.role === "filter-footer";
            });
          const applyButton = within(footer[0]).getAllByRole("button")[1];
          expect(applyButton).toBeEnabled();
          fireEvent.click(applyButton);
          expect(onApply).toHaveBeenCalled();
          expect(onApply).toHaveBeenCalledWith({
            columnFilters: {},
            globalFilters: {
              [globalFilters[0][0]]: {
                100: true,
              },
            },
          });
        });

        test("global filter must render pinned options and more button", async () => {
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters {...TableWithGlobalFilters.args} />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          expect(pinnedGlobalFilterButtons.length).toBe(3); // Hardcoding because actual Table filters are not fetched from API
          const moreButton = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role !== "filter-icon";
            });
          expect(moreButton.length).toBe(
            4 // Hardcoding because actual Table filters are not fetched from API
          );
        });

        test("onApply should be invoked when clearing applied filters on list", async () => {
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithPreAppliedGlobalFilters
                  {...TableWithPreAppliedGlobalFilters.args}
                  filterOptions={{
                    ...TableWithPreAppliedGlobalFilters.args.filterOptions,
                    globalFilters: {
                      ...TableWithPreAppliedGlobalFilters.args.filterOptions
                        .globalFilters,
                      defaultFilters: {
                        1: {
                          101: true,
                        },
                      },
                    },
                    onApply: onApply,
                  }}
                />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          fireEvent.click(pinnedGlobalFilterButtons[0]);
          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();
          const checkboxes = within(filterMenu).getAllByRole("checkbox");
          expect(checkboxes[1]).toBeChecked();

          const footer = within(filterMenu)
            .getAllByRole("region")
            .filter((region) => {
              return region.dataset.role === "filter-footer";
            });
          const clearButton = within(footer[0]).getAllByRole("button")[0];
          const applyButton = within(footer[0]).getAllByRole("button")[1];
          expect(applyButton).toBeDisabled();
          // fireEvent.click(checkboxes[1]);
          fireEvent.click(clearButton);
          expect(checkboxes[1]).not.toBeChecked();

          expect(applyButton).toBeEnabled();
          fireEvent.click(applyButton);
          expect(onApply).toHaveBeenCalled();
          expect(onApply).toHaveBeenCalledWith({
            columnFilters: {},
            globalFilters: {},
          });
        });

        test("onApply should be invoked when clearing applied filters on date range", async () => {
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithPreAppliedGlobalFilters
                  {...TableWithPreAppliedGlobalFilters.args}
                  filterOptions={{
                    ...TableWithPreAppliedGlobalFilters.args.filterOptions,
                    globalFilters: {
                      ...TableWithPreAppliedGlobalFilters.args.filterOptions
                        .globalFilters,
                      defaultFilters: {
                        bookingDate: [
                          new Date("2022-12-22"),
                          new Date("2022-12-24"),
                        ],
                      },
                    },
                    onApply: onApply,
                  }}
                />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          fireEvent.click(pinnedGlobalFilterButtons[1]);
          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();

          const footer = within(filterMenu)
            .getAllByRole("region")
            .filter((region) => {
              return region.dataset.role === "filter-footer";
            });
          const clearButton = within(footer[0]).getAllByRole("button")[0];
          const applyButton = within(footer[0]).getAllByRole("button")[1];
          fireEvent.click(clearButton);

          fireEvent.click(applyButton);
          expect(onApply).toHaveBeenCalled();
          expect(onApply).toHaveBeenCalledWith({
            columnFilters: {},
            globalFilters: {},
          });
        });

        test("onApply should be invoked when clearing applied filters on range", async () => {
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithPreAppliedGlobalFilters
                  {...TableWithPreAppliedGlobalFilters.args}
                  filterOptions={{
                    ...TableWithPreAppliedGlobalFilters.args.filterOptions,
                    globalFilters: {
                      ...TableWithPreAppliedGlobalFilters.args.filterOptions
                        .globalFilters,
                      defaultFilters: {
                        favoriteNumber: [10, 50],
                      },
                    },
                    onApply: onApply,
                  }}
                />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          fireEvent.click(pinnedGlobalFilterButtons[2]);
          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();

          const footer = within(filterMenu)
            .getAllByRole("region")
            .filter((region) => {
              return region.dataset.role === "filter-footer";
            });
          const clearButton = within(footer[0]).getAllByRole("button")[0];
          const applyButton = within(footer[0]).getAllByRole("button")[1];
          fireEvent.click(clearButton);

          fireEvent.click(applyButton);
          expect(onApply).toHaveBeenCalled();
          expect(onApply).toHaveBeenCalledWith({
            columnFilters: {},
            globalFilters: {},
          });
        });

        test("click on minus should hide the global filter", async () => {
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters
                  {...TableWithGlobalFilters.args}
                  filterOptions={{
                    ...TableWithGlobalFilters.args.filterOptions,
                  }}
                />
              )
          );
          const filterButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          expect(filterContainer[0]).toBeInTheDocument();
          const hideButton = within(tableFilterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "global-filter-hide-icon";
            })[0];
          fireEvent.click(hideButton);
          await waitFor(() =>
            expect(tableFilterContainer[0]).not.toBeVisible()
          );
        });

        test("clicking outside should hide the filter menu ", async () => {
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters
                  {...TableWithGlobalFilters.args}
                  filterOptions={{
                    ...TableWithGlobalFilters.args.filterOptions,
                  }}
                />
              )
          );
          const filterButton = screen.queryAllByRole("button")[0];
          fireEvent.click(filterButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();

          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          expect(filterContainer[0]).toBeInTheDocument();

          const filterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          fireEvent.click(filterButtons[0]);

          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();

          fireEvent.click(document.body);
          await waitFor(() => expect(filterMenu).not.toBeInTheDocument());
        });
      });

      describe("Without discrete apply button", () => {
        test("global filter must render pinned options, more button, apply button, tooltip and cancel button", async () => {
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters {...TableWithGlobalFilters.args} />
              )
          );
          const filterTriggerButton = screen.queryAllByRole("button")[0];
          await userEventPro.click(filterTriggerButton);
          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();
          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          expect(pinnedGlobalFilterButtons.length).toBe(3); // Hardcoding because actual Table filters are not fetched from API
          const moreButton = within(filterContainer[0]).getByDzUniqueId(
            "stories-1671275604473-button"
          );
          expect(moreButton).toBeInTheDocument();
          const applyButton = within(filterContainer[0]).getByDzUniqueId(
            "stories-1694414059759-button"
          );
          expect(applyButton).toBeInTheDocument();

          const tooltipTrigger = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => button.dataset.role === "tooltip-trigger")[0];
          await userEventPro.hover(tooltipTrigger);
          const tooltip = screen.getByRole("tooltip");
          expect(tooltip).toBeInTheDocument();

          const cancelIcon = screen.getByDzUniqueId("svgcancel-1671377595106");
          expect(cancelIcon).toBeInTheDocument();
        });

        test("onApply should be invoked when applying global filters", async () => {
          const globalFilters = Object.entries(
            TableWithGlobalFilters.args.filterOptions.globalFilters.items
          );
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters
                  {...TableWithGlobalFilters.args}
                  filterOptions={{
                    ...TableWithGlobalFilters.args.filterOptions,
                    onApply: onApply,
                  }}
                />
              )
          );

          const filterTriggerButton = screen.queryAllByRole("button")[0];
          await userEventPro.click(filterTriggerButton);

          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();

          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          await userEventPro.click(pinnedGlobalFilterButtons[0]);

          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();

          const checkboxes = within(filterMenu).getAllByRole("checkbox");
          await userEventPro.click(checkboxes[0]);
          await userEventPro.click(document.body);

          const applyButton = within(filterContainer[0]).getByDzUniqueId(
            "stories-1694414059759-button"
          );
          expect(applyButton).toBeInTheDocument();
          await userEventPro.click(applyButton);

          expect(onApply).toHaveBeenCalled();
          expect(onApply).toHaveBeenCalledWith({
            columnFilters: {},
            globalFilters: {
              [globalFilters[0][0]]: {
                100: true,
              },
            },
          });
        });

        test("onCancelAndToggle filter should revert with previously applied filter", async () => {
          const onApply = jest.fn();
          await act(
            async () =>
              await render(
                <TableWithGlobalFilters
                  {...TableWithGlobalFilters.args}
                  filterOptions={{
                    ...TableWithGlobalFilters.args.filterOptions,
                    onApply: onApply,
                  }}
                />
              )
          );

          const filterTriggerButton = screen.queryAllByRole("button")[0];
          await userEventPro.click(filterTriggerButton);

          const allRegions = screen.getAllByRole("region");
          const tableFilterContainer = allRegions.filter((region) => {
            return region.dataset.role === "table-global-filter";
          });
          expect(tableFilterContainer[0]).toBeInTheDocument();

          const filterContainer = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });
          const pinnedGlobalFilterButtons = within(filterContainer[0])
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          await userEventPro.click(pinnedGlobalFilterButtons[0]);

          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenu = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenu).toBeInTheDocument();

          const checkboxes = within(filterMenu).getAllByRole("checkbox");

          await userEventPro.click(checkboxes[0]);
          await userEventPro.click(document.body);

          const cancelButton = screen.getByDzUniqueId(
            "svgcancel-1671377595106"
          );
          await userEventPro.click(cancelButton);

          await userEventPro.click(filterTriggerButton);

          const filterContainerReQueried = allRegions.filter((region) => {
            return region.dataset.role === "filter-container";
          });

          const pinnedGlobalFilterButtonsReQueried = within(
            filterContainerReQueried[0]
          )
            .getAllByRole("button")
            .filter((button) => {
              return button.dataset.role === "filter-button";
            });
          await userEventPro.click(pinnedGlobalFilterButtonsReQueried[0]);

          // eslint-disable-next-line testing-library/prefer-screen-queries
          const filterMenuReQueried = getByRole(
            // eslint-disable-next-line testing-library/no-node-access
            document.getElementById("disprz-popper"),
            "menu"
          );
          expect(filterMenuReQueried).toBeInTheDocument();

          const checkboxesReQueried =
            within(filterMenuReQueried).getAllByRole("checkbox");

          expect(checkboxesReQueried[0]).not.toBeChecked();
        });

        // Skipped for now because waitFor currently doesn't work with render. Requires R&D.
        test.skip("should throw an error when default items key is not available in filter options", async () => {
          const onApply = jest.fn();

          await waitFor(() =>
            expect(() =>
              render(
                <TableWithPreAppliedGlobalFilters
                  {...TableWithPreAppliedGlobalFilters.args}
                  filterOptions={{
                    ...TableWithPreAppliedGlobalFilters.args.filterOptions,
                    globalFilters: {
                      ...TableWithPreAppliedGlobalFilters.args.filterOptions
                        .globalFilters,
                      defaultFilters: {
                        ...TableWithPreAppliedGlobalFilters.args.filterOptions
                          .globalFilters.defaultFilters,
                        datePickerRange: [10, 50],
                      },
                    },
                    onApply: onApply,
                  }}
                />
              )
            ).toThrow(
              `Default filters with datePickerRange doesn't have an equivalent item prop on filterOptions`
            )
          );
        });
      });

      test("filter icon must not be rendered if when canEnableFilter or canEnableGlobalFilter is disabled", async () => {
        await act(
          async () =>
            await render(
              <TableWithGlobalFilters
                {...TableWithGlobalFilters.args}
                filterOptions={{
                  ...TableWithGlobalFilters.args.filterOptions,
                  canEnableFilter: false,
                }}
              />
            )
        );
        const filterButton = within(
          screen.getByTestId("filter-search-container")
        ).queryByRole("button");
        expect(filterButton).not.toBeInTheDocument();

        await act(
          async () =>
            await render(
              <TableWithGlobalFilters
                {...TableWithGlobalFilters.args}
                filterOptions={{
                  ...TableWithGlobalFilters.args.filterOptions,
                  canEnableGlobalFilter: false,
                }}
              />
            )
        );
        const filterButton2 = within(
          screen.getAllByTestId("filter-search-container")[1]
        ).queryByRole("button");
        expect(filterButton2).not.toBeInTheDocument();
      });

      test("filter button to show global filter must be rendered", async () => {
        await act(
          async () =>
            await render(
              <TableWithGlobalFilters
                {...TableWithGlobalFilters.args}
                filterOptions={{
                  ...TableWithGlobalFilters.args.filterOptions,
                }}
              />
            )
        );
        const filterButton = screen.queryAllByRole("button")[0];
        expect(filterButton).toBeInTheDocument();
      });

      test("global filter options must be rendered when filter button is clicked", async () => {
        await act(
          async () =>
            await render(
              <TableWithGlobalFilters
                {...TableWithGlobalFilters.args}
                filterOptions={{
                  ...TableWithGlobalFilters.args.filterOptions,
                }}
              />
            )
        );
        const filterButton = screen.queryAllByRole("button")[0];
        await userEventPro.click(filterButton);
        const allRegions = screen.getAllByRole("region");
        const tableFilterContainer = allRegions.filter((region) => {
          return region.dataset.role === "table-global-filter";
        });
        expect(tableFilterContainer[0]).toBeInTheDocument();
        const filterContainer = allRegions.filter((region) => {
          return region.dataset.role === "filter-container";
        });
        expect(filterContainer[0]).toBeInTheDocument();
      });
    });
  });

  describe("Table with Expandable Row", () => {
    const subRowRenderer = (row) => {
      const subColumns = [
        {
          id: "proficiencyLevel",
          key: "proficiencyLevel",
        },
        {
          key: "assessmentType",
          title: "Assessment Type",
        },
        {
          key: "assessmenturl",
          title: "Assessment URL",
        },
      ];
      const subRows = [
        {
          proficiencyLevel: "Level1",
          assessmentType: "Type",
          assessmenturl: "URL",
        },
      ];
      return (
        <table>
          <tr style={{ paddingLeft: 0 }}>
            {subColumns.map((header) => {
              return (
                <th
                  key={header.key}
                  className={header.ctrCls}
                  style={{ minWidth: header.width, width: header.width }}
                >
                  {header.title}
                </th>
              );
            })}
          </tr>
          {subRows.map((innerrow, index) => {
            return (
              <tr style={{ paddingLeft: 0 }} key={index}>
                {subColumns.map((header, index) => {
                  if (typeof header.onRenderer === "function") {
                    return (
                      <td style={{ paddingLeft: 0 }} key={index}>
                        {header.onRenderer({
                          subRow: innerrow,
                          currentRow: row,
                        })}
                      </td>
                    );
                  }
                  return (
                    <td
                      style={{
                        minWidth: header.width,
                        width: header.width,
                        paddingLeft: 0,
                      }}
                      key={index}
                    >
                      {innerrow[header.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </table>
      );
    };
    test("Expanding Table must not render when enableExpanding is false", async () => {
      await act(
        async () =>
          await render(
            <RowExpandable
              columns={columns}
              expandOptions={{
                enableExpanding: false,
              }}
            />
          )
      );
      const rowExpander = screen.queryByRole("row-expander-container");
      expect(rowExpander).not.toBeInTheDocument();
    });
    test("Expanding Table must render when enableExpanding is true and canExpandRow return true", async () => {
      await act(
        async () =>
          await render(
            <RowExpandable
              columns={columns}
              expandOptions={{
                enableExpanding: true,
                onRenderer: ({ row }) => {
                  subRowRenderer(row);
                },
                // eslint-disable-next-line no-unused-vars
                canExpandRow: ({ row }) => {
                  return true;
                },
                onChange: () => jest.fn(),
                type: TableExpansionType.NON_COHESIVE,
              }}
            />
          )
      );
      const rowExpander = within(screen.queryByRole("row-expander-container"));
      expect(rowExpander).toBeTruthy();
    });
    test("Expanding Table must not render when enableExpanding is true and canExpandRow return false", async () => {
      await act(
        async () =>
          await render(
            <RowExpandable
              columns={columns}
              expandOptions={{
                enableExpanding: true,
                onRenderer: ({ row }) => {
                  subRowRenderer(row);
                },
                // eslint-disable-next-line no-unused-vars
                canExpandRow: ({ row }) => {
                  return false;
                },
                type: TableExpansionType.NON_COHESIVE,
                onChange: () => jest.fn(),
              }}
            />
          )
      );
      const rowExpander = screen.queryByRole("row-expander-container");
      expect(rowExpander).not.toBeInTheDocument();
    });
    test("Expanding Table must invoke onChange when accordion click", async () => {
      const onExpandedChange = jest.fn();
      await act(
        async () =>
          await render(
            <RowExpandable
              columns={columns}
              expandOptions={{
                enableExpanding: true,
                onRenderer: ({ row }) => {
                  subRowRenderer(row);
                },
                // eslint-disable-next-line no-unused-vars
                canExpandRow: ({ row }) => {
                  return true;
                },
                type: TableExpansionType.NON_COHESIVE,
                onChange: () => onExpandedChange,
              }}
            />
          )
      );
      const rowExpander = screen.queryAllByRole("row-expander")[0];
      fireEvent.click(rowExpander);
      expect(rowExpander).toBeInTheDocument();
    });
    test("Expanding Table must not render sub row when type is COHESIVE", async () => {
      await act(
        async () =>
          await render(
            <RowExpandable
              columns={columns}
              expandOptions={{
                type: TableExpansionType.COHESIVE,
              }}
            />
          )
      );
      const expandedCell = screen.queryByRole("expanded-cell");
      expect(expandedCell).not.toBeInTheDocument();
    });
  });
});
