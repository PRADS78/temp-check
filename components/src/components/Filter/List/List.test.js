import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
  userEventPro,
} from "test-utils";
import {
  FilterListSelectionType,
  FilterLocalizedBannerDuration,
} from "../../../Enums";
import List from "./List";
import OnDemandList from "./OnDemandList";
import PaginatedList from "./PaginatedList";

describe("Filter List", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const items = [
    {
      label: "Chennai",
      value: "chennai",
    },
    {
      label: "Bangalore",
      value: "bangalore",
    },
    {
      label: "Mumbai",
      value: "mumbai",
    },
    {
      label: "Pune",
      value: "pune",
    },
    {
      label: "Hyderabad",
      value: "hyderabad",
    },
    {
      label: "Kolkata",
      value: "kolkata",
    },
    {
      label: "Delhi",
      value: "delhi",
    },
  ];

  test("must render correctly", async () => {
    await act(async () => await render(<List isOpen={true} options={items} />));
    const container = screen.getByRole("dialog");
    const menu = screen.getByRole("menu");
    expect(container).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
  });

  test("must render all items", async () => {
    await act(async () => await render(<List isOpen={true} options={items} />));
    const container = screen.getByRole("menu");
    const options = within(container).getAllByRole("listitem");
    expect(options.length).toBe(items.length);
  });

  test("must render default selected items", async () => {
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    selectedOptions[items[1].value] = true;
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            selectedOptions={selectedOptions}
          />
        )
    );
    const container = screen.getByRole("menu");
    const options = within(container).getAllByRole("checkbox");
    expect(options[0]).toBeChecked();
    expect(options[1]).toBeChecked();
  });

  test("must render search input", async () => {
    await act(
      async () =>
        await render(<List isOpen={true} options={items} isSearchable={true} />)
    );
    const container = screen.getByRole("menu");
    const searchInput = within(container).getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  test("must not render search input", async () => {
    await act(
      async () =>
        await render(
          <List isOpen={true} options={items} isSearchable={false} />
        )
    );
    const container = screen.getByRole("menu");
    const searchInput = within(container).queryByRole("textbox");
    expect(searchInput).not.toBeInTheDocument();
  });

  test("must render clear all and apply button", async () => {
    await act(async () => await render(<List isOpen={true} options={items} />));
    const container = screen.getByRole("menu");
    const clearAllButton = within(container).getAllByRole("button");
    expect(clearAllButton[0]).toBeInTheDocument();
    expect(clearAllButton[1]).toBeInTheDocument();
  });

  test("onCancel must be invoked and rendered when no items are selected", async () => {
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(<List isOpen={true} options={items} onCancel={onCancel} />)
    );
    const container = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const cancelButton = within(container).getAllByRole("button")[0];
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(onCancel).toBeCalled();
  });

  test("onClear must be render when any item is selected", async () => {
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            onCancel={onCancel}
            selectedOptions={selectedOptions}
          />
        )
    );
    const container = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const clearAllButton = within(container).getAllByRole("button", {
      name: "Clear All", // TODO: Replace with language config when implemented
    })[0];
    expect(clearAllButton).toBeInTheDocument();
  });

  test("clearAll must disable apply button for mandatory items", async () => {
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            isMandatory={true}
            options={items}
            onCancel={onCancel}
            selectedOptions={selectedOptions}
          />
        )
    );
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    expect(options[0]).toBeChecked();
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const footerButtons = within(footer).getAllByRole("button");
    const clearAllButton = footerButtons[0];
    const applyButton = footerButtons[1];
    expect(applyButton).toBeInTheDocument();
    fireEvent.click(clearAllButton);
    expect(options[0]).not.toBeChecked();
    expect(applyButton).toBeDisabled();
  });
  test("clearAll must disable apply button when minimum selection is available", async () => {
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    selectedOptions[items[1].value] = true;
    const min = 2;
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            min={min}
            options={items}
            onCancel={onCancel}
            selectedOptions={selectedOptions}
          />
        )
    );
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    expect(options[0]).toBeChecked();
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const footerButtons = within(footer).getAllByRole("button");
    const clearAllButton = footerButtons[0];
    const applyButton = footerButtons[1];
    expect(applyButton).toBeInTheDocument();
    await userEventPro.click(clearAllButton);
    expect(options[0]).not.toBeChecked();
    expect(options[1]).not.toBeChecked();
    expect(applyButton).toBeDisabled();
  });
  test("clearAll must clear all the selected items", async () => {
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            onCancel={onCancel}
            selectedOptions={selectedOptions}
          />
        )
    );
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    expect(options[0]).toBeChecked();
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const clearAllButton = within(footer).getAllByRole("button", {
      name: "Clear All", // TODO: Replace with language config when implemented
    })[0];
    fireEvent.click(clearAllButton);
    expect(options[0]).not.toBeChecked();
  });

  test("isOpen must not render the menu", async () => {
    await act(
      async () => await render(<List isOpen={false} options={items} />)
    );
    const container = screen.queryByRole("menu");
    expect(container).not.toBeInTheDocument();
  });

  test("isMultiSelect must render multiple checkboxes when applied", async () => {
    await act(
      async () =>
        await render(
          <List isOpen={true} options={items} isMultiSelect={true} />
        )
    );
    const container = screen.getByRole("menu");
    const options = within(container).getAllByRole("checkbox");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
    const selectedOptions = within(container)
      .getAllByRole("checkbox")
      .filter((check) => {
        return check.checked;
      });
    expect(selectedOptions.length).toBe(2);
  });

  test("isMultiSelect must render radio group when not applied", async () => {
    await act(
      async () =>
        await render(
          <List isOpen={true} options={items} isMultiSelect={false} />
        )
    );
    const container = screen.getByRole("menu");
    const options = within(container).getAllByRole("radio");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
    const selectedOptions = within(container)
      .getAllByRole("radio")
      .filter((check) => {
        return check.checked;
      });
    expect(selectedOptions.length).toBe(1);
  });

  test("onApply must be invoked", async () => {
    const onApply = jest.fn();
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            isMultiSelect={true}
            onApply={onApply}
          />
        )
    );
    const container = screen.getAllByRole("menu")[0];
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const firstCheckbox = within(container).getAllByRole("checkbox")[0];
    fireEvent.click(firstCheckbox);
    const applyButton = within(footer).getAllByRole("button")[1];
    expect(applyButton).toBeInTheDocument();
    fireEvent.click(applyButton);
    expect(onApply).toBeCalled();
  });

  test("isLoading must render loading text", async () => {
    // TODO: Replace with actual loader when implemented
    await act(
      async () =>
        await render(<List isOpen={true} options={items} isLoading={true} />)
    );
    const container = screen.getByRole("menu");
    const loadingText = within(container).getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });

  test("search results must be filtered", async () => {
    await act(
      async () =>
        await render(<List isOpen={true} options={items} isSearchable={true} />)
    );
    const container = screen.getByRole("menu");
    const searchInput = within(container).getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "Chennai" } });
    const options = within(container).getAllByRole("listitem");
    expect(options.length).toBe(1);
  });

  test("clearing search results must render all options", async () => {
    await act(
      async () =>
        await render(<List isOpen={true} options={items} isSearchable={true} />)
    );
    const container = screen.getByRole("menu");
    const searchInput = within(container).getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "Chennai" } });
    let options = within(container).getAllByRole("listitem");
    expect(options.length).toBe(1);
    const clearButton = within(container).getAllByRole("button")[1];
    fireEvent.click(clearButton);
    options = within(container).getAllByRole("listitem");
    expect(options.length).toBe(items.length);
  });

  test("selected options must not be rendered when selectionType is filtering", async () => {
    const onCancel = jest.fn();
    const onApply = jest.fn();
    const { rerender } = await render(
      <List
        isOpen={true}
        options={items}
        selectionType={FilterListSelectionType.FILTERING}
        onApply={onApply}
        onCancel={onCancel}
      />
    );
    const container = await screen.findByRole("menu");
    const initialOptionsLength =
      within(container).getAllByRole("listitem").length;
    const options = within(container).getAllByRole("checkbox");
    fireEvent.click(options[0]);
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const applyButton = within(footer).getAllByRole("button")[1];
    fireEvent.click(applyButton);
    await waitFor(() => expect(onApply).toBeCalled());
    const modifiedItems = items.filter((item, index) => {
      return index !== 0;
    });
    expect(modifiedItems.length).toBe(6);
    rerender(
      <List
        isOpen={true}
        options={modifiedItems}
        selectionType={FilterListSelectionType.FILTERING}
        onApply={onApply}
        onCancel={onCancel}
      />
    );

    const selectedOptionsLength =
      within(container).getAllByRole("listitem").length;
    expect(selectedOptionsLength).toBe(initialOptionsLength - 1);
  });

  test("apply button state must reflect the selection changes", async () => {
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            isSearchable={true}
            selectedOptions={{}}
          />
        )
    );
    const container = screen.getByRole("menu");
    const firstCheckbox = within(container).getAllByRole("checkbox")[0];
    fireEvent.click(firstCheckbox);
    const footer = screen.getAllByRole("region").filter((area) => {
      return area.dataset.role === "filter-footer";
    })[0];
    const applyButton = within(footer).getAllByRole("button")[1];
    expect(applyButton).toBeEnabled();
    fireEvent.click(firstCheckbox);
    expect(applyButton).toBeDisabled();
  });

  test("disabled item must not be selectable", async () => {
    items[0].isDisabled = true;
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            isSearchable={true}
            selectedOptions={{}}
          />
        )
    );
    const container = screen.getByRole("menu");
    const firstCheckbox = within(container).getAllByRole("checkbox")[0];
    const firstListBox = within(container).getAllByRole("listitem")[0];
    expect(firstCheckbox).toBeDisabled();
    expect(firstListBox).toHaveClass("disabled");
  });

  test("onOpen must not be called isOpen is set to false ", async () => {
    const onOpen = jest.fn();
    render(
      <OnDemandList
        isOpen={false}
        options={[]}
        isSearchable={true}
        onOpen={onOpen}
      />
    );
    expect(onOpen).not.toBeCalled();
  });

  test("onOpen must not be called more than once", async () => {
    const onOpen = jest.fn();
    const onDemandOptions = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
      {
        label: "Bangalore",
        value: "bangalore",
      },
      {
        label: "Hyderabad",
        value: "hyderabad",
      },
      {
        label: "Pune",
        value: "pune",
      },
      {
        label: "Delhi",
        value: "delhi",
      },
      {
        label: "Kolkata",
        value: "kolkata",
      },
      {
        label: "Ahmedabad",
        value: "ahmedabad",
      },
    ];
    onOpen.mockResolvedValueOnce({
      options: onDemandOptions,
    });
    const { rerender } = await render(
      <OnDemandList
        isOpen={true}
        options={[]}
        isSearchable={true}
        onOpen={onOpen}
      />
    );
    expect(onOpen).toBeCalledTimes(1);
    rerender(
      <OnDemandList
        isOpen={true}
        options={[]}
        isSearchable={true}
        onOpen={onOpen}
      />
    );
    expect(onOpen).toBeCalledTimes(1);
  });

  test("isLoading must be set to true when onOpen is called", async () => {
    const onOpen = jest.fn();
    const onDemandOptions = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
    ];
    onOpen.mockResolvedValueOnce({
      options: onDemandOptions,
    });
    // WARNING: Don't wrap this with act, it will fail
    render(
      <OnDemandList
        isOpen={true}
        options={[]}
        isSearchable={true}
        onOpen={onOpen}
      />
    );
    await waitFor(() => {
      const loadingText = screen.getByText(/Loading.../);
      expect(loadingText).toBeInTheDocument();
    });
  });

  test("onOpen must be called when clicking on button and using onDemand list", async () => {
    const onOpen = jest.fn();
    const { rerender } = await render(
      <OnDemandList
        isOpen={false}
        options={[]}
        isSearchable={true}
        onOpen={onOpen}
      />
    );
    const onDemandOptions = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
      {
        label: "Bangalore",
        value: "bangalore",
      },
      {
        label: "Hyderabad",
        value: "hyderabad",
      },
      {
        label: "Pune",
        value: "pune",
      },
      {
        label: "Delhi",
        value: "delhi",
      },
      {
        label: "Kolkata",
        value: "kolkata",
      },
      {
        label: "Ahmedabad",
        value: "ahmedabad",
      },
    ];
    onOpen.mockResolvedValueOnce({
      options: onDemandOptions,
    });
    await act(
      async () =>
        await rerender(
          <OnDemandList
            isOpen={true}
            options={[]}
            isSearchable={true}
            onOpen={onOpen}
          />
        )
    );
    expect(onOpen).toBeCalled();
    await waitFor(() => {
      const menuItems = screen.getAllByRole("listitem");
      expect(menuItems.length).toBe(onDemandOptions.length);
    });
  });

  // TODO: Yet to resolve issue, why `onReachBottom` on PaginatedList is not receiving updated props.
  test.skip("onReachBottom must be invoked when scrolling to bottom", async () => {
    const onReachBottom = jest.fn();
    const firstPage = {
      options: [
        {
          label: "Thanjavur",
          value: "thanjavur",
        },
      ],
      isEndOfList: false,
    };
    onReachBottom.mockResolvedValue(firstPage);
    const { rerender } = render(
      <PaginatedList options={items} isOpen onReachBottom={onReachBottom} />
    );

    const listBox = screen.getByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });
    await waitFor(() => expect(onReachBottom).toBeCalled());
    const listItemsAfterFirstScroll = screen.getAllByRole("listitem");
    expect(listItemsAfterFirstScroll.length).toBe(
      items.length + firstPage.options.length
    );

    const secondPage = {
      options: [
        {
          label: "Jeyamkondan",
          value: "jeyamkondan",
        },
        {
          label: "Kumbakonam",
          value: "kumbakonam",
        },
      ],
      isEndOfList: true,
    };
    const onReachBottomSecondPage = jest.fn();
    onReachBottomSecondPage.mockResolvedValueOnce(secondPage);
    await act(
      async () =>
        await rerender(
          <PaginatedList
            options={items}
            isOpen
            onReachBottom={onReachBottomSecondPage}
          />
        )
    );
    fireEvent.scroll(listBox, { target: { scrollTop: 600 } });
    await waitFor(() => expect(onReachBottomSecondPage).toBeCalled());
    const listItemsAfterSecondScroll = screen.getAllByRole("listitem");
    expect(listItemsAfterSecondScroll.length).toBe(
      items.length + firstPage.options.length + secondPage.options.length
    );
  });

  test("onReachBottom must be invoked when previous onReachBottom return isEndOfList as true", async () => {
    const onReachBottom = jest.fn();
    const firstPage = {
      options: [
        {
          label: "Thanjavur",
          value: "thanjavur",
        },
      ],
      isEndOfList: true,
    };
    onReachBottom.mockResolvedValue(firstPage);
    const { rerender } = render(
      <PaginatedList options={items} isOpen onReachBottom={onReachBottom} />
    );

    const listBox = await screen.findByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });
    await waitFor(() => expect(onReachBottom).toBeCalled());
    const listItemsAfterFirstScroll = screen.getAllByRole("listitem");
    expect(listItemsAfterFirstScroll.length).toBe(
      items.length + firstPage.options.length
    );

    const secondPage = {
      options: [
        {
          label: "Jeyamkondan",
          value: "jeyamkondan",
        },
        {
          label: "Kumbakonam",
          value: "kumbakonam",
        },
      ],
      isEndOfList: true,
    };
    const onReachBottomSecondPage = jest.fn();
    onReachBottomSecondPage.mockResolvedValueOnce(secondPage);
    await act(
      async () =>
        await rerender(
          <PaginatedList
            options={items}
            isOpen
            onReachBottom={onReachBottomSecondPage}
          />
        )
    );
    fireEvent.scroll(listBox, { target: { scrollTop: 300 } });
    await waitFor(() => expect(onReachBottomSecondPage).not.toBeCalled());
  });

  test("max should limit the selection of List item and show a alert dialog when reached", async () => {
    const max = 2;
    const items = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Bangalore",
        value: "bangalore",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
    ];
    await act(
      async () => await render(<List isOpen={true} options={items} max={max} />)
    );
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    await userEventPro.click(options[0]);
    expect(options[0]).toBeChecked();
    await userEventPro.click(options[1]);
    expect(options[1]).toBeChecked();
    await userEventPro.click(options[2]);
    expect(options[2]).not.toBeChecked();
    const alertDialog = await screen.findByRole("alertdialog");
    expect(alertDialog).toBeInTheDocument();

    expect(alertDialog).toHaveTextContent(
      `Please narrow down your search by selecting up to ${max} options`
    );
    expect(alertDialog).toHaveClass("active");
    await waitFor(() => expect(alertDialog).not.toHaveClass("active"), {
      timeout: FilterLocalizedBannerDuration.OPTION_LIMIT + 1,
    });
  });

  test("min should limit the deselection of list item and show alert banner", async () => {
    const min = 2;
    const items = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Bangalore",
        value: "bangalore",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
    ];
    const selectedOptions = {};
    selectedOptions[items[0].value] = true;
    selectedOptions[items[1].value] = true;
    await act(
      async () =>
        await render(
          <List
            isOpen={true}
            options={items}
            selectedOptions={selectedOptions}
            min={min}
          />
        )
    );
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    expect(options[0]).toBeChecked();
    expect(options[1]).toBeChecked();
    await userEventPro.click(options[1]);
    const alertDialog = await screen.findByRole("alertdialog");
    expect(alertDialog).toBeInTheDocument();

    expect(alertDialog).toHaveTextContent(
      `Please select at least ${min} options to proceed.`
    );
    expect(alertDialog).toHaveClass("active");
    await waitFor(() => expect(alertDialog).not.toHaveClass("active"), {
      timeout: FilterLocalizedBannerDuration.OPTION_LIMIT + 1,
    });
  });

  test("limit selection popup banner should not appear when max is not set", async () => {
    const items = [
      {
        label: "Chennai",
        value: "chennai",
      },
      {
        label: "Bangalore",
        value: "bangalore",
      },
      {
        label: "Mumbai",
        value: "mumbai",
      },
    ];
    await act(async () => await render(<List isOpen={true} options={items} />));
    const container = screen.getAllByRole("menu");
    const options = within(container[0]).getAllByRole("checkbox");
    await userEventPro.click(options[0]);
    expect(options[0]).toBeChecked();
    await userEventPro.click(options[1]);
    expect(options[1]).toBeChecked();
    await userEventPro.click(options[2]);
    expect(options[2]).toBeChecked();
    const alertDialog = screen.queryByRole("alertdialog");
    expect(alertDialog).not.toBeInTheDocument();
  });
});
