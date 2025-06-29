import { fireEvent, render, screen, userEventPro } from "test-utils";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./DatePicker.stories";
import moment from "moment";
import { within, act } from "@testing-library/react";
import { patchTimeToEndOfDay } from "../../Utils";

const {
  MultiSelect,
  Range,
  Standard,
  WithTime,
  WithCustomActions,
  WithQuarterTilldateActions,
} = composeStories(stories);

describe("DatePicker", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    await act(async () => await null);
    const container = screen.getByRole("main");
    expect(container).toHaveClass(ctrCls);
  });

  test("popperCtrCls must be applied", async () => {
    const popperCtrCls = "custom-popper-container-class";
    render(<Standard popperCtrCls={popperCtrCls} />);
    const calendarIcon = await screen.findByRole("button");
    fireEvent.click(calendarIcon);
    await act(async () => await null);
    const input = screen.getByRole("main");
    fireEvent.click(input);
    // Doing this because the date picker popper is not accepting any roles
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector(`.${popperCtrCls}`)).toBeInTheDocument();
  });

  test("name must be applied to the input", async () => {
    const inputName = "date-picker-input-name";
    render(<Standard name={inputName} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    expect(input.name).toBe(inputName);
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} />);
    const calendarIcon = await screen.findByRole("button");
    fireEvent.click(calendarIcon);
    const calendarOptions = screen.getAllByRole("option");
    await act(async () => await null);
    fireEvent.click(calendarOptions[0]);
    expect(onChange).toHaveBeenCalled();
  });

  test("onChange for range must be invoked with start and end appropriately", async () => {
    const onChange = jest.fn();
    //TODO:fix the dates issue , currently need to hardcode every 3 months
    const startDate = new Date("2025/04/01");
    let endDate = new Date("2025/04/10");

    startDate.setHours(0, 0, 0, 0);
    endDate = patchTimeToEndOfDay(endDate);

    render(<Range onChange={onChange} defaultDates={[]} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const todayOption = screen.getAllByText(startDate.getDate())[0];
    const oneWeekOption = screen.getAllByText(endDate.getDate())[0];

    await userEventPro.click(todayOption);
    expect(onChange).toHaveBeenCalledWith([
      new Date(startDate.toISOString()),
      null,
    ]);

    await userEventPro.click(oneWeekOption);

    expect(onChange).toHaveBeenCalledWith([
      new Date(startDate.toISOString()),
      new Date(endDate.toISOString()),
    ]);
  });

  test("label must be rendered", async () => {
    const label = "Selected date";
    render(<Standard label={label} />);
    await act(async () => await null);
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test("selected date must be shown", async () => {
    const date = new Date();
    render(<Standard defaultDates={[date]} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(moment(date).format("DD/MM/yyyy"));
  });

  test("dateFormat must be applied", async () => {
    const dateFormat = "yyyy/MM/dd";
    render(<Standard defaultDates={[new Date()]} dateFormat={dateFormat} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(
      moment(new Date()).format(dateFormat.toUpperCase())
    );
  });

  test("yearDropDown must not be rendered if canShowYearDropDown is 'false'", async () => {
    render(<Standard canShowYearDropDown={false} />);
    await act(async () => await null);
    const calendarIcon = screen.getByRole("button");
    fireEvent.click(calendarIcon);
    const listboxes = screen.getAllByRole("listbox");
    // there would be 2 listboxes if yearDropDown is shown
    expect(listboxes.length).toBe(1);
  });

  test("disabled date picker must not render listboxes", async () => {
    render(<Standard isDisabled={true} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    const listboxes = screen.queryAllByRole("listbox");
    expect(listboxes.length).toBe(0);
    expect(input).toBeDisabled();
  });

  test("placeholder must be rendered", async () => {
    const placeholder = "date placeholder";
    render(<Standard placeholder={placeholder} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    expect(input.placeholder).toBe(placeholder);
  });

  test("multiSelect variant must be rendered if it is enabled", async () => {
    render(<MultiSelect />);
    await act(async () => await null);
    const mainComponent = screen.getByRole("main");
    expect(mainComponent).toHaveClass("multiSelect");
  });

  test("multiSelectedDates prop's first date must be shown", async () => {
    const selected = new Date("2022/03/07");
    const multiSelectedDates = [selected];
    render(<MultiSelect defaultDates={multiSelectedDates} />);
    await act(async () => await null);
    const selectedYearButton = await screen.findByText(
      moment(selected).format("DD MMM,yyy")
    );
    expect(selectedYearButton).toBeInTheDocument();
  });

  test("onSelect must be invoked", async () => {
    const onSelect = jest.fn();
    render(<Standard onSelect={onSelect} />);
    await act(async () => await null);
    const calendarIcon = screen.getByRole("button");
    fireEvent.click(calendarIcon);
    const calendarOptions = screen.getAllByRole("option");
    fireEvent.click(calendarOptions[2]);
    expect(onSelect).toHaveBeenCalled();
  });

  test("time input must be rendered if canShowTimeInput is 'true'", async () => {
    render(<WithTime />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const regions = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "custom-time-picker";
    });
    expect(regions.length).toBe(1);
  });

  test("start and end date range must be shown", async () => {
    const startDate = new Date("2022/02/07");
    const endDate = new Date("2022/02/11");
    render(<Range defaultDates={[[startDate, endDate]]} />);
    const input = await screen.findByRole("textbox");
    const dateFormat = "DD/MM/yyyy";
    const rangeValue = `${moment(startDate).format(dateFormat)} - ${moment(
      endDate
    ).format(dateFormat)}`;
    expect(input).toHaveValue(rangeValue);
  });

  test("selectRange mode for date picker must be permitted", async () => {
    const startDate = new Date("2022/06/01");
    const endDate = new Date("2022/06/03");
    render(<Range defaultDates={[[startDate, endDate]]} />);
    await act(async () => await null);
    const input = screen.getByRole("textbox");
    const dateFormat = "DD/MM/yyyy";
    const rangeValue = `${moment(startDate).format(dateFormat)} - ${moment(
      endDate
    ).format(dateFormat)}`;
    expect(input).toHaveValue(rangeValue);
  });

  test("date picker year range should be reflected", async () => {
    const startYear = 2000,
      endYear = new Date().getFullYear();
    render(<Standard yearRange={[startYear, endYear]} />);
    const dateButton = await screen.findByRole("button");
    fireEvent.click(dateButton);
    const yearDropdownButton = screen.getAllByDzUniqueId(
      "svgdownarrow-1666943365647"
    );
    fireEvent.click(yearDropdownButton[0]);
    const yearListBox = screen.getAllByRole("listbox")[0];
    const firstYear = within(yearListBox).getByText(startYear.toString());
    const lastYear = within(yearListBox).getByText(endYear.toString());
    const yearItems = within(yearListBox).getAllByRole("listitem");
    expect(yearListBox).toBeInTheDocument();
    expect(firstYear).toBeInTheDocument();
    expect(lastYear).toBeInTheDocument();
    expect(yearItems.length).toBe(endYear - startYear + 1);
    expect(yearItems[0]).toHaveTextContent(startYear.toString());
    expect(yearItems[yearItems.length - 1]).toHaveTextContent(
      endYear.toString()
    );
  });

  test("on reopen date picker should show the selected dates instead of patched end date provided by date picker", async () => {
    const onChange = jest.fn();

    // TODO: Hardcoding dates every two months, find alternative
    const startDate = new Date("2023/10/06");
    let endDate = new Date("2023/10/12");

    startDate.setHours(0, 0, 0, 0);
    endDate = patchTimeToEndOfDay(endDate);

    render(<Range onChange={onChange} defaultDates={[[startDate, endDate]]} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const todayOption = screen.getAllByText(startDate.getDate())[0];
    const oneWeekOption = screen.getAllByText(endDate.getDate())[0];

    await userEventPro.click(todayOption);
    expect(onChange).toHaveBeenCalledWith([
      new Date(startDate.toISOString()),
      null,
    ]);

    await userEventPro.click(oneWeekOption);

    expect(onChange).toHaveBeenCalledWith([
      new Date(startDate.toISOString()),
      new Date(endDate.toISOString()),
    ]);

    const reQueriedCalendarIcon = screen.getByRole("button");
    await userEventPro.click(reQueriedCalendarIcon);

    const reQueriedOneWeekOption = screen.getAllByText(endDate.getDate())[0];

    expect(todayOption).toHaveClass(
      "react-datepicker__day--selecting-range-start"
    );
    expect(reQueriedOneWeekOption).toHaveClass(
      "react-datepicker__day--range-end"
    );
  });

  test("Time only custom actions shouldn't patch the end date", async () => {
    const onChange = jest.fn();

    await render(<WithCustomActions onChange={onChange} defaultDates={[]} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    jest.useFakeTimers();
    const quickActions = screen.getByLabelText("quick-actions");
    expect(quickActions).toBeInTheDocument();

    const twentyFourHoursButton = await screen.findByDzUniqueId(
      "stories-1666074600270-last-24-button"
    );

    const now = new Date();
    const yesterday = new Date(new Date().setDate(now.getDate() - 1));
    await userEventPro.click(twentyFourHoursButton);

    expect(onChange).toHaveBeenCalledWith([yesterday, now], expect.anything());
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("show the today button if minDate is less than or equal to today", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} defaultDates={[]} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const todayBtnElement = screen.getByDzUniqueId(
      "stories-1666074787676-button"
    );
    expect(todayBtnElement).toBeInTheDocument();
  });

  test("show today button if mindate is today", async () => {
    const onChange = jest.fn();
    const today = new Date();
    render(<Standard onChange={onChange} defaultDates={[]} minDate={today} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const todayBtnElement = screen.getByDzUniqueId(
      "stories-1666074787676-button"
    );
    expect(todayBtnElement).toBeInTheDocument();
  });

  test("show today button if maxDate is today", async () => {
    const onChange = jest.fn();
    const today = new Date();
    render(<Standard onChange={onChange} defaultDates={[]} maxDate={today} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const todayBtnElement = screen.getByDzUniqueId(
      "stories-1666074787676-button"
    );
    expect(todayBtnElement).toBeInTheDocument();
  });

  test("hide today button if mindate is in future date", async () => {
    const onChange = jest.fn();
    const tmrw = new Date(moment().add(1, "days"));
    render(<Standard onChange={onChange} defaultDates={[]} minDate={tmrw} />);
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const todayBtnElement = screen.queryByDzUniqueId(
      "stories-1666074787676-button"
    );
    expect(todayBtnElement).not.toBeInTheDocument();
  });

  test("hide today button if maxdate is in past date", async () => {
    const onChange = jest.fn();
    const yesterday = new Date(moment().add(-1, "days"));
    render(
      <Standard onChange={onChange} defaultDates={[]} maxDate={yesterday} />
    );
    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);
    const todayBtnElement = screen.queryByDzUniqueId(
      "stories-1666074787676-button"
    );
    expect(todayBtnElement).not.toBeInTheDocument();
  });
});
describe("DatePicker with Custom Quick Actions", () => {
  const originalDate = global.Date;

  beforeEach(() => {
    const mockDate = new Date(2025, 5, 14); // (Q2 of 2025)
    global.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          return mockDate;
        }
        return new originalDate(...args);
      }
      static now() {
        return mockDate.getTime();
      }
    };
  });

  afterEach(() => {
    global.Date = originalDate;
  });
  test("default actions should be displayed", async () => {
    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions onChange={onChange} defaultDates={[]} />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const thisWeekButton = screen.getByText(/This Week/i);
    const last15Button = screen.getByText(/Last 15 Days/i);
    const last30Button = screen.getByText(/Last 30 Days/i);
    const last3MonthsButton = screen.getByText(/3 Months/i);
    const next2DaysButton = screen.getByText(/Next 2 days/i);

    expect(thisWeekButton).toBeInTheDocument();
    expect(last15Button).toBeInTheDocument();
    expect(last30Button).toBeInTheDocument();
    expect(last3MonthsButton).toBeInTheDocument();
    expect(next2DaysButton).toBeInTheDocument();
  });
  test("quarter till date actions should be displayed when includeQuarterTillDateActions is true", async () => {
    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions onChange={onChange} defaultDates={[]} />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const q2Button = screen.getByText(/Apr 2025/i);
    const q1Button = screen.getByText(/Jan 2025/i);
    const q4Button = screen.getByText(/Oct 2024/i);
    const q3Button = screen.getByText(/Jul 2024/i);

    expect(q2Button).toBeInTheDocument();
    expect(q1Button).toBeInTheDocument();
    expect(q4Button).toBeInTheDocument();
    expect(q3Button).toBeInTheDocument();
  });
  test("quarter till date actions should not be displayed when includeQuarterTillDateActions is false", async () => {
    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions
        includeQuarterTillDateActions={false}
        onChange={onChange}
        defaultDates={[]}
      />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const q2Button = screen.queryByText(/Apr 2025/i);
    const q1Button = screen.queryByText(/Jan 2025/i);
    const q4Button = screen.queryByText(/Oct 2024/i);
    const q3Button = screen.queryByText(/Jul 2024/i);

    expect(q2Button).not.toBeInTheDocument();
    expect(q1Button).not.toBeInTheDocument();
    expect(q4Button).not.toBeInTheDocument();
    expect(q3Button).not.toBeInTheDocument();
  });

  test("clicking Q1 2025 quarter button should set correct date range", async () => {
    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions onChange={onChange} defaultDates={[]} />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const q1Button = screen.getByText(/Jan 2025/i);
    await userEventPro.click(q1Button);

    const expectedStartDate = new Date(2025, 0, 1, 0, 0, 0, 0);
    const expectedEndDate = new Date(2025, 5, 14, 23, 59, 59, 999);

    expect(onChange).toHaveBeenCalledWith(
      [expectedStartDate, expectedEndDate],
      expect.anything()
    );
  });

  test("clicking Q4 2024 quarter button should set correct date range", async () => {
    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions onChange={onChange} defaultDates={[]} />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const q4Button = screen.getByText(/Oct 2024/i);
    await userEventPro.click(q4Button);

    const expectedStartDate = new Date(2024, 9, 1, 0, 0, 0, 0);
    const expectedEndDate = new Date(2025, 5, 14, 23, 59, 59, 999);

    expect(onChange).toHaveBeenCalledWith(
      [expectedStartDate, expectedEndDate],
      expect.anything()
    );
  });

  test("quarter actions should follow the fiscal year pattern across year boundaries", async () => {
    const mockDate = new Date(2025, 2, 6); //(Q1 of 2025)
    global.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          return mockDate;
        }
        return new originalDate(...args);
      }
      static now() {
        return mockDate.getTime();
      }
    };

    const onChange = jest.fn();
    render(
      <WithQuarterTilldateActions onChange={onChange} defaultDates={[]} />
    );

    const calendarIcon = await screen.findByRole("button");
    await userEventPro.click(calendarIcon);

    const q1Button = screen.getByText(/Jan 2025/i);
    const q4Button = screen.getByText(/Oct 2024/i);
    const q3Button = screen.getByText(/Jul 2024/i);
    const q2Button = screen.getByText(/Apr 2024/i);

    expect(q1Button).toBeInTheDocument();
    expect(q4Button).toBeInTheDocument();
    expect(q3Button).toBeInTheDocument();
    expect(q2Button).toBeInTheDocument();
  });
});
