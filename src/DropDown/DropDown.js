import { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "./DropDown.scss";

/**
 * @deprecated
 */
class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownShown: false,
    };
  }

  render() {
    const dropdownItems = [];

    this.props.items.forEach((dropdownItem, i) => {
      let dropDown = typeof dropdownItem == "object" ? dropdownItem : {};
      if (typeof dropDown !== "undefined") {
        if (typeof this.props.valueRenderFunction === "function") {
          // let renderer = this.props.valueRenderFunction;
        }

        if (typeof dropDown.value === "undefined") {
          dropDown.value = i;
        }

        if (typeof dropDown.display != "undefined") {
          dropDown.label = dropDown.display;
        } else {
          dropDown.label = dropdownItem.label;
        }

        if (typeof dropDown == "object") {
          dropdownItems.push(dropDown);
        }
      }
    });

    return (
      <div className={"dropdown v2 " + this.props.ctrCls}>
        {this.props.customOptionRenderer ? (
          <Select
            name="form-field-name"
            value={this.props.value}
            components={{ Option: this.props.customOptionRenderer }}
            isSearchable={this.props.searchable}
            isClearable={this.props.isClearable}
            isMulti={this.props.isMulti}
            classNamePrefix="disprz-Select"
            menuPosition={this.props.menuPosition}
            placeholder={this.props.placeholder}
            options={dropdownItems}
            onChange={this.selectDropdownItem}
            isDisabled={this.props.isDisabled}
            isLoading={this.props.isLoading}
          />
        ) : (
          <Select
            name="form-field-name"
            value={this.props.value}
            isSearchable={this.props.searchable}
            isClearable={this.props.isClearable}
            isMulti={this.props.isMulti}
            classNamePrefix="disprz-Select"
            menuPosition={this.props.menuPosition}
            placeholder={this.props.placeholder}
            options={dropdownItems}
            onChange={this.selectDropdownItem}
            isDisabled={this.props.isDisabled}
            isLoading={this.props.isLoading}
          />
        )}
      </div>
    );
  }
  showHideDropdown = (e) => {
    e.stopPropagation();
    this.setState({
      dropdownShown: !this.state.dropdownShown,
    });
  };

  selectDropdownItem = (e) => {
    this.setState(
      {
        dropdownShown: false,
      },
      () => {
        this.props.onSelect(e);
      }
    );
  };
}
DropDown.propTypes = {
  /**
   * Specify the list of dropdown items to make the dropdown values
   */
  items: PropTypes.array.isRequired,
  /**
   * define name for the input identity
   */
  name: PropTypes.string,
  /**
   * Specify the value prop for the dropdown
   */
  value: PropTypes.any.isRequired,
  /**
   * Instead of the value is used  for the dropdown
   */
  defaultItemIndex: PropTypes.number,
  /**
   * user defined class name for the dropdown
   */
  ctrCls: PropTypes.string,
  /**
   * Help to select multiple item by this boolean value
   */
  isMulti: PropTypes.bool,
  /**
   * Custom option function to render customized dropdown value
   * const CustomOption = props => {
   *   const { data, innerRef, innerProps } = props;
   *   return (<div>{data.label}</div>)
   *  };
   * function App() {
   *    return <DropDown customOptionRenderer={CustomOption} options={options} />;
   * }
   */
  customOptionRenderer: PropTypes.func,
  /**
   * Specify the onSelect function is selection function for the dropdown
   */
  onSelect: PropTypes.func.isRequired,
  /**
   * Specify the displayTriggerRenderer act as value render function
   */
  displayTriggerRenderer: PropTypes.func,
  /**
   * Specify the placeholder text for the dropdown
   */
  placeholder: PropTypes.string,
  /**
   * Specify true if close icon is needed
   */
  isClearable: PropTypes.bool,
  /**
   * Specify true if search is needed
   */
  searchable: PropTypes.bool,
  menuPosition: PropTypes.string,
  valueRenderFunction: PropTypes.func,
  /**
   * Specify true if loading needs to be displayed
   */
  isLoading: PropTypes.bool,
  /**
   * Specify true if dropdown is disabled
   */
  isDisabled: PropTypes.bool,
};

DropDown.defaultProps = {
  ctrCls: "",
  name: "dropdown",
  searchable: false,
  isClearable: false,
  isMulti: false,
  menuPosition: "",
  onSelect: () => {},
  valueRenderFunction: undefined,
  displayTriggerRenderer: null,
  placeholder: "Select...",
  items: [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ],
  value: null,
  isDisabled: false,
  isLoading: false,
};

export default DropDown;
