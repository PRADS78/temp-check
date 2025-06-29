import { Component } from "react";
import AppIcon from "../AppIcon/AppIcon";
import PropTypes from "prop-types";

class RequiredField extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var invalidMessageDisplay = "",
      renderLabelItem = "";
    if (this.props.labelItem) {
      renderLabelItem = (
        <div className="input-label-item inline-block">
          {this.props.labelItem}
        </div>
      );
    }
    if (this.props.invalidMessage) {
      invalidMessageDisplay = (
        <div className="invalid-message">{this.props.invalidMessage}</div>
      );
    }

    return (
      <div className={"required-field " + this.props.ctrCls}>
        {renderLabelItem}
        <AppIcon ctrCls="required-field-icon" iconCls="icon-required-field" />
        {this.props.children}
        {invalidMessageDisplay}
      </div>
    );
  }
}
RequiredField.PropTypes = {
  ctrCls: PropTypes.string,
  invalidMessage: PropTypes.string,
  labelItem: PropTypes.any,
};
RequiredField.defaultProps = {
  ctrCls: "",
  invalidMessage: "",
  labelItem: "",
};
export default RequiredField;
