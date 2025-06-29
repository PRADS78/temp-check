import { act, fireEvent, render, screen, within } from "test-utils";
import DateRange from "./DateRange";
import userEvent from "@testing-library/user-event";

describe("Filter Date Range", () => {
  test("must render Date Range", async () => {
    render(<DateRange isOpen={true} onCancel={() => {}} onApply={() => {}} />);
    const container = await screen.findByRole("dialog");
    const menu = await screen.findByRole("menu");
    expect(container).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
  });

  test("onApply must be invoked when no dates are selected", async () => {
    const onApply = jest.fn();
    render(<DateRange isOpen={true} onCancel={() => {}} onApply={onApply} />);
    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const buttons = await within(footer[0]).findAllByRole("button");
    const applyButton = buttons[1];
    await userEvent.click(applyButton);
    expect(onApply).toHaveBeenCalled();
  });

  test("onApply must be invoked when a range is selected", async () => {
    const onApply = jest.fn();
    render(
      <DateRange
        isOpen={true}
        onCancel={() => {}}
        onApply={onApply}
        referenceElement={{}}
      />
    );
    const today = new Date();
    const tomorrow = new Date(new Date().setDate(today.getDate() + 1));

    const isDifferentMonth = today.getMonth() !== tomorrow.getMonth();

    const startDateEl = await screen.findAllByText(today.getDate());
    const startDate = startDateEl.filter((date) => {
      return !date.className.includes("react-datepicker__day--outside-month"); // TODO: Find a better way to do this
    })[0];
    let endDatesEl = await screen.findAllByText(tomorrow.getDate());
    const endDates = endDatesEl.filter((date) => {
      return !date.className.includes("react-datepicker__day--outside-month"); // TODO: Find a better way to do this
    });
    const endDate = isDifferentMonth ? endDates[1] : endDates[0];
    await userEvent.click(startDate);
    await userEvent.click(endDate);
    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const buttons = await within(footer[0]).findAllByRole("button");
    const applyButton = buttons[1];
    await userEvent.click(applyButton);
    expect(onApply).toHaveBeenCalled();
  });

  test("onCancel must be invoked", async () => {
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <DateRange
            isOpen={true}
            onCancel={onCancel}
            onApply={() => {}}
            referenceElement={{}}
          />
        )
    );
    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const buttons = await within(footer[0]).findAllByRole("button");
    const cancelButton = buttons[0];
    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  test("preSelected range must be selected", async () => {
    const today = new Date("2023/10/06");
    const tomorrow = new Date("2023/10/07");
    await act(
      async () =>
        await render(
          <DateRange
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            referenceElement={{}}
            selectedRange={[today, tomorrow]}
          />
        )
    );
    const startDateEl = await screen.findAllByText(today.getDate());
    const startDate = startDateEl[0];
    const endDateEl = await screen.findAllByText(tomorrow.getDate());
    const endDate = endDateEl[0];
    expect(startDate).toHaveClass("react-datepicker__day--range-start");
    expect(endDate).toHaveClass("react-datepicker__day--range-end");
  });

  test("apply button should be disabled unless selection is made for mandatory date range", async () => {
    const today = new Date("2023/10/06");
    const tomorrow = new Date("2023/10/07");
    await act(
      async () =>
        await render(
          <DateRange
            isOpen={true}
            isMandatory={true}
            onCancel={() => {}}
            onApply={() => {}}
            referenceElement={{}}
            selectedRange={[today, tomorrow]}
          />
        )
    );
    const startDateEl = await screen.findAllByText(today.getDate());
    const startDate = startDateEl[0];
    const endDateEl = await screen.findAllByText(tomorrow.getDate());
    const endDate = endDateEl[0];
    expect(startDate).toHaveClass("react-datepicker__day--range-start");
    expect(endDate).toHaveClass("react-datepicker__day--range-end");

    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const buttons = await within(footer[0]).findAllByRole("button");
    const clearAllButton = buttons[0];
    fireEvent.click(clearAllButton);
    expect(startDate).not.toHaveClass("react-datepicker__day--range-start");
    expect(endDate).not.toHaveClass("react-datepicker__day--range-end");
    const buttonsAfterClick = await within(footer[0]).findAllByRole("button");
    const applyButton = buttonsAfterClick[1];
    expect(applyButton).toBeDisabled();
  });

  test("onClearAll must clear the selected range", async () => {
    const today = new Date("2023/10/06");
    const tomorrow = new Date("2023/10/07");
    await act(
      async () =>
        await render(
          <DateRange
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            referenceElement={{}}
            selectedRange={[today, tomorrow]}
          />
        )
    );
    const startDateEl = await screen.findAllByText(today.getDate());
    const startDate = startDateEl[0];
    const endDateEl = await screen.findAllByText(tomorrow.getDate());
    const endDate = endDateEl[0];
    expect(startDate).toHaveClass("react-datepicker__day--range-start");
    expect(endDate).toHaveClass("react-datepicker__day--range-end");

    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const buttons = await within(footer[0]).findAllByRole("button");
    const clearAllButton = buttons[0];
    fireEvent.click(clearAllButton);
    expect(startDate).not.toHaveClass("react-datepicker__day--range-start");
    expect(endDate).not.toHaveClass("react-datepicker__day--range-end");
  });

  test("isApply disabled when only one date is selected", async () => {
    await act(async () => await render(<DateRange isOpen={true} />));
    const footerRegion = await screen.findAllByRole("region");
    const footer = footerRegion.filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const today = new Date();
    const startDateEl = await screen.findAllByText(today.getDate());
    const startDate = startDateEl[0];
    fireEvent.click(startDate);
    const buttonsAfterClick = await within(footer[0]).findAllByRole("button");
    const applyButton = buttonsAfterClick[1];
    expect(applyButton).toBeDisabled();
  });
});
