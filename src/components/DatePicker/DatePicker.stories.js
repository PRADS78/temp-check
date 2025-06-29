import { DatePicker } from ".";
import { DatePickerTypes } from "../../Enums";
import moment from "moment";

const storyConfig = {
  title: "Disprz/DisprzDatePicker",
  component: DatePicker,
};

export default storyConfig;

function Template(args) {
  const initialDate = new Date();
  initialDate.setHours(13);
  initialDate.setMinutes(30);

  const containerStyle = {
    height: "400px",
    padding: "15px",
    textAlign: "right",
    width: "500px",
  };

  const renderDatePicker = () => {
    if (args.type === DatePickerTypes.RANGE) {
      return (
        <DatePicker
          {...args}
          onChange={args.onChange ? args.onChange : () => undefined}
          uniqueId={1666074700328}
        />
      );
    }

    if (args.type === DatePickerTypes.MULTI_SELECT) {
      return (
        <DatePicker
          {...args}
          onSelect={args.onSelect ? args.onSelect : () => undefined}
          uniqueId={1666074700328}
        />
      );
    }

    return (
      <DatePicker
        {...args}
        onChange={args.onChange ? args.onChange : () => undefined}
        uniqueId={1666074700328}
      />
    );
  };

  return (
    <div data-testid="date-picker-container" style={containerStyle}>
      {renderDatePicker()}
    </div>
  );
}
export const Standard = Template.bind({});
Standard.args = {
  label: "Date",
  defaultDates: [new Date("2022/03/07")],
};

export const Range = Template.bind({});
Range.args = {
  canShowTimeInput: false,
  defaultDates: [[new Date("2022/03/07"), new Date("2022/03/11")]],
  onQuickActions: (defaultActions) => {
    const quickActionRange = {
      id: "next-2",
      label: "Next 2 days",
      range: -2,
      onCustomRange: (callback) => {
        const daysRange = [
          new Date(moment().add(1, "days").format("yyyy/MM/DD")),
          new Date(moment().add(2, "days").format("yyyy/MM/DD")),
        ];
        callback(daysRange);
      },
    };
    defaultActions.push(quickActionRange);
  },
  type: DatePickerTypes.RANGE,
};

const dateWithTime = new Date();
dateWithTime.setHours(13);
dateWithTime.setMinutes(30);
export const WithTime = Template.bind({});
WithTime.args = {
  dateFormat: "dd/MM/yyyy h:mm a",
  defaultDates: [dateWithTime],
  canShowTimeInput: true,
  selected: dateWithTime,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  defaultDates: [dateWithTime],
  onSelect: null,
  type: DatePickerTypes.MULTI_SELECT,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Standard.args,
  isDisabled: true,
};

export const WithCustomActions = Template.bind({});
WithCustomActions.args = {
  ...Range.args,
  onQuickActions: (actions) => {
    const quickActionRange = [
      {
        id: "last-24",
        label: "Last 24 hours",
        range: 0,
        canIgnoreEndDateTimePatch: true,
        onCustomRange: (callback) => {
          const today = new Date();
          const last24Hours = new Date();
          last24Hours.setDate(today.getDate() - 1);
          const dates = [last24Hours, today];
          callback(dates);
        },
      },
      {
        id: "last-1",
        label: "Last 1 day",
        range: 0,
        onCustomRange: (callback) => {
          const yesterday = new Date(
            moment().add(-1, "days").format("yyyy/MM/DD")
          );
          const dates = [yesterday, yesterday];
          callback(dates);
        },
      },
      {
        id: "last-48",
        label: "Last 48 hours",
        range: 0,
        canIgnoreEndDateTimePatch: true,
        onCustomRange: (callback) => {
          const today = new Date();
          const last48Hours = new Date();
          last48Hours.setDate(today.getDate() - 2);
          const dates = [last48Hours, today];
          callback(dates);
        },
      },
    ];
    actions.push(...quickActionRange);
  },
};

export const WithQuarterTilldateActions = Template.bind({});
WithQuarterTilldateActions.args = {
  ...Range.args,
  includeQuarterTillDateActions: true,
};

const parameters = {
  jest: ["DatePicker.test.js"],
};

Standard.parameters =
  Range.parameters =
  WithTime.parameters =
  MultiSelect.parameters =
    parameters;
