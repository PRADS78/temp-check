import { createRef, Component } from "react";
import DropDown from "../DropDown/DropDown";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import AppButton from "../AppButton/AppButton";
import moment from "moment/moment";

class TimeDurationDropDown extends Component {
  constructor(props) {
    super(props);

    this.fromDateRef = createRef();
    this.toDateRef = createRef();

    this.state = {
      toDate: props.availableUntil,
      fromDate: props.availableFrom,
      selectedTimePeriod: props.defaultTimePeriodValue,
    };
  }
  render() {
    return (
      <div className={"td-wrapper"}>
        <div className="input-item datepicker-select-container">
          <div className="input-label-item ">Select Duration</div>
          <DropDown
            items={this.props.timeOptions}
            onSelect={this.setSelectedTimePeriod}
            value={this.state.selectedTimePeriod}
          />
        </div>
        <div className={"custom-period-wrapper"}>
          <div className="input-item datepicker-flex datepicker-container">
            <div className="input-label-item datepicker-container">From</div>
            <DateTimePicker
              ref={this.fromDateRef}
              ctrCls="datepicker available-from feedback-widget"
              placeholder={"From (date & time)"}
              includeTimeSelection={false}
              initialValue={this.state.fromDate}
              onDateChange={this.setFromDate}
              disabled={this.state.selectedTimePeriod?.value !== 6}
            />
          </div>
          <div className="input-item datepicker-flex datepicker-container">
            <div className="input-label-item datepicker-container">To</div>
            <DateTimePicker
              ref={this.toDateRef}
              ctrCls="datepicker available-until feedback-widget"
              placeholder={"Until (date & time)"}
              includeTimeSelection={false}
              initialValue={this.state.toDate}
              onDateChange={this.setToDate}
              disabled={this.state.selectedTimePeriod?.value !== 6}
            />
          </div>
          {this.state.selectedTimePeriod &&
            this.state.selectedTimePeriod.value === 6 && (
              <div className="filter-btn-container">
                <AppButton
                  buttonLabel="Search"
                  buttonCls="filter-btn app-button"
                  buttonIconCls="icon-filter-search"
                  disabled={
                    this.state.fromDate.length === 0 &&
                    this.state.toDate.length === 0
                  }
                  clickHandler={this.onTimeSelection}
                />
              </div>
            )}
        </div>
      </div>
    );
  }

  setFromDate = (dateValue) => {
    this.setState({
      fromDate: moment(dateValue),
    });
  };
  setToDate = (dateValue) => {
    this.setState({
      toDate: moment(dateValue),
    });
  };
  onTimeSelection = () => {
    this.props.onTimeSelection(this.state.fromDate, this.state.toDate);
  };
  setSelectedTimePeriod = (value) => {
    this.setState(
      {
        selectedTimePeriod: value,
        toDate: value.availableUntil,
        fromDate: value.availableFrom,
      },
      () => {
        if (this.state.selectedTimePeriod.value !== 6) {
          this.props.onTimeSelection(this.state.fromDate, this.state.toDate);
        }
      }
    );
  };
}

TimeDurationDropDown.defaultProps = {
  onTimeSelection: () => {},
  customTimePeriod: false,
  availableUntil: moment(),
  availableFrom: moment().subtract(7, "d"),
};
export default TimeDurationDropDown;
