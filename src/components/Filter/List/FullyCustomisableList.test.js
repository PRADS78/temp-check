import { act, fireEvent, render, screen, waitFor, within } from "test-utils";
import FullyCustomisableList from "./FullyCustomisableList";
import userEvent from "@testing-library/user-event";

describe("FullyCustomisableList", () => {
  test("must call onReachBottom when the user scrolls to the bottom", async () => {
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
    render(
      <FullyCustomisableList
        onReachBottom={onReachBottom}
        options={[]}
        isOpen={true}
        isSearchable={true}
      />
    );

    const listBox = await screen.findByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });

    await waitFor(() => expect(onReachBottom).toHaveBeenCalled());
  });

  test("must call onExternalSearch with the correct search text", async () => {
    const mockOnExternalSearch = jest.fn();
    const mockOptions = [{ label: "chennai", value: "chennai" }];

    mockOnExternalSearch.mockResolvedValue({ options: mockOptions });
    await render(
      <FullyCustomisableList
        onExternalSearch={mockOnExternalSearch}
        options={[]}
        isOpen={true}
      />
    );

    const container = await screen.findByRole("menu");
    const searchInput = within(container).getByRole("textbox");
    await userEvent.type(searchInput, "chennai");

    await waitFor(() =>
      expect(mockOnExternalSearch).toHaveBeenCalledWith("chennai")
    );
  });

  test("Should show filtered options as per search text", async () => {
    const mockOnExternalSearch = jest.fn();
    const mockOptions = [{ label: "chennai", value: "chennai" }];

    mockOnExternalSearch.mockResolvedValue({ options: mockOptions });

    await render(
      <FullyCustomisableList
        onExternalSearch={mockOnExternalSearch}
        isOpen={true}
        isSearchable={true}
      />
    );

    const container = await screen.findByRole("menu");
    const searchInput = within(container).getByRole("textbox");
    await userEvent.type(searchInput, "chennai");

    await waitFor(() =>
      expect(mockOnExternalSearch).toHaveBeenCalledWith("chennai")
    );

    const filteredItems = screen.getAllByText("chennai");
    expect(filteredItems.length).toBe(1);
  });

  test("Should manage loading state correctly when fetching more items", async () => {
    const mockOnReachBottom = jest.fn().mockResolvedValue({
      options: [
        { label: "chennai", value: "chennai" },
        { label: "pune", value: "pune" },
      ],
      isEndOfList: false,
    });
    const mockOnExternalSearch = jest.fn();

    await render(
      <FullyCustomisableList
        onReachBottom={mockOnReachBottom}
        onExternalSearch={mockOnExternalSearch}
        isOpen={true}
      />
    );

    const container = await screen.findByRole("menu");
    const listBox = within(container).getByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });
    await waitFor(() => {
      const loadingIndicator = within(container).queryAllByText(/Loading/);
      expect(loadingIndicator.length).toBe(1);
    });

    await waitFor(() => {
      const loadingIndicator = within(container).queryAllByText(/Loading/);
      expect(loadingIndicator.length).toBe(0);
    });
  });

  test("onReachBottom must not be invoked when previous onReachBottom return isEndOfList as true", async () => {
    const mockOnReachBottom = jest.fn();
    const firstPage = {
      options: [
        {
          label: "Thanjavur",
          value: "thanjavur",
        },
      ],
      isEndOfList: true,
    };
    mockOnReachBottom.mockResolvedValue(firstPage);
    const { rerender } = await render(
      <FullyCustomisableList
        options={[]}
        onReachBottom={mockOnReachBottom}
        isOpen={true}
      />
    );

    const listBox = await screen.findByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });
    await waitFor(() => expect(mockOnReachBottom).toBeCalled());
    const listItemsAfterFirstScroll = screen.getAllByRole("listitem");
    expect(listItemsAfterFirstScroll.length).toBe(firstPage.options.length);

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
          <FullyCustomisableList
            isOpen
            onReachBottom={onReachBottomSecondPage}
          />
        )
    );
    fireEvent.scroll(listBox, { target: { scrollTop: 300 } });
    await waitFor(() => expect(onReachBottomSecondPage).not.toBeCalled());
  });

  test("must call onReachBottom only once preventing duplicate debounce", async () => {
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
    render(
      <FullyCustomisableList
        onReachBottom={onReachBottom}
        options={[]}
        isOpen={true}
        isSearchable={true}
      />
    );

    const listBox = await screen.findByRole("listbox");
    fireEvent.scroll(listBox, { target: { scrollTop: 200 } });
    fireEvent.scroll(listBox, { target: { scrollTop: 400 } });
    fireEvent.scroll(listBox, { target: { scrollTop: 600 } });

    await waitFor(() => expect(onReachBottom).toHaveBeenCalledTimes(1));
  });
});
