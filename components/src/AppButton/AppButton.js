import { Component } from "react";
import AppIcon from "../AppIcon/AppIcon";
import PropTypes from "prop-types";
import "./AppButton.scss";
import { ButtonTypes } from "../Enums";

/**
 * @deprecated
 */
class AppButton extends Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    // Console warning AppButton is deprecated.
    // console.warn("AppButton is deprecated. Use AppButtonRefactored instead.");
  }

  handleButtonClick(e) {
    if (this.props.disabled === true) {
      e.stopPropagation();
      return;
    }

    if (this.props.clickHandler) {
      this.props.clickHandler(e);
    }
  }

  focus = () => {
    this.refs.buttonEle.focus();
  };
  getButtonElement = () => {
    return this.refs.buttonEle;
  };

  render() {
    let buttonLabel = this.props.buttonLabel;
    let iconOnlyCss =
      buttonLabel && (buttonLabel.length > 0 || typeof buttonLabel === "object")
        ? ""
        : "icon-only";
    let disabledCls = this.props.disabled === true ? "btn-disabled" : "";
    let additionalCls = `${iconOnlyCss} ${disabledCls} ${this.props.ctrCls} ${this.props.type}`;
    let buttonLabelStyle = {};
    let buttonIcon = "";

    if (buttonLabel && buttonLabel.length > 0) {
      buttonLabel = (
        <span className="app-button-label" style={buttonLabelStyle}>
          {buttonLabel}
        </span>
      );
    }
    if (this.props.buttonIconCls && this.props.buttonIconCls.length) {
      buttonIcon = (
        <AppIcon
          iconCls={this.props.buttonIconCls}
          iconColor={this.props.buttonIconColor}
          isNewIcon={this.props.isNewIcon}
        />
      );
    }

    return (
      <button
        title={this.props.tooltipText}
        ref="buttonEle"
        className={"app-button v2 " + additionalCls}
        onClick={this.handleButtonClick}
        disabled={this.props.disabled}
      >
        {buttonIcon}
        {buttonLabel}
        {this.props.children}
      </button>
    );
  }
}

AppButton.propTypes = {
  /**
   * Specify type for the button
   */
  type: PropTypes.oneOf(["primary", "outlined", "plain"]),
  /**
   * Specify label for the button
   */
  buttonLabel: PropTypes.any,
  /**
   * Specify custom class for button control
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the button icon class name
   */
  buttonIconCls: PropTypes.string,
  /**
   * Specify the tooltip for the button
   */
  tooltipText: PropTypes.string,
  /**
   * Helps to disable the button control
   */
  disabled: PropTypes.bool,
  /**
   * Custom function for the button control
   */
  clickHandler: PropTypes.func,
};

AppButton.defaultProps = {
  type: ButtonTypes.PRIMARY,
  buttonLabel: "",
  ctrCls: "",
  buttonIconCls: "",
  clickHandler: () => {},
};

export default AppButton;
