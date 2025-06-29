import { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Transition } from "react-transition-group";
import AppButton from "../AppButton/AppButton";
import CONSTANTS from "../Constants";
import "./Toast.scss";
import AppIcon from "../AppIcon/AppIcon";

/**
 * @deprecated
 */
class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationEndClass: "",
    };
  }

  componentDidMount() {
    if (this.props.autoHide) {
      setTimeout(() => {
        this.onCancelClick();
      }, this.props.autoHideTimeOut || 1000);
    }
  }

  getPositionClass = () => {
    const { position } = this.props;
    let posClass = "top-right";
    switch (position) {
      case Toast.Position.BOTTOM_RIGHT:
        posClass = "bot-right";
        break;
      case Toast.Position.BOTTOM_CENTER:
        posClass = "bot-center";
        break;
      case Toast.Position.BOTTOM_LEFT:
        posClass = "bot-left";
        break;
      case Toast.Position.TOP_CENTER:
        posClass = "top-center";
        break;
      case Toast.Position.TOP_LEFT:
        posClass = "top-left";
        break;
      case Toast.Position.TOP_RIGHT:
        posClass = "top-right";
        break;

      default:
        break;
    }
    return posClass;
  };
  getTypeClass = () => {
    const { toastType } = this.props;
    let toastTypeClass = "success";
    switch (toastType) {
      case Toast.Type.SUCCESS:
        toastTypeClass = "success";
        break;
      case Toast.Type.FAIL:
        toastTypeClass = "fail";
        break;
      case Toast.Type.WARN:
        toastTypeClass = "warn";
        break;
      case Toast.Type.INFO:
        toastTypeClass = "info";
        break;
      case Toast.Type.NEUTRAL:
        toastTypeClass = "netural";
        break;
      default:
        break;
    }
    return toastTypeClass;
  };
  getHeadIcon = () => {
    const { toastType } = this.props;
    switch (toastType) {
      case Toast.Type.SUCCESS:
        return (
          <AppIcon
            ctrCls="icon-toast-cls"
            iconCls="icon-success-toast"
          ></AppIcon>
        );
      case Toast.Type.FAIL:
        return (
          <AppIcon ctrCls="icon-toast-cls" iconCls="icon-fail-toast"></AppIcon>
        );
      case Toast.Type.WARN:
        return (
          <AppIcon ctrCls="icon-toast-cls" iconCls="icon-warn-toast"></AppIcon>
        );
      case Toast.Type.INFO:
        return (
          <AppIcon ctrCls="icon-toast-cls" iconCls="icon-info-toast"></AppIcon>
        );
      case Toast.Type.NEUTRAL:
        return null;
      default:
        return (
          <AppIcon
            ctrCls="icon-toast-cls"
            iconCls="icon-success-toast"
          ></AppIcon>
        );
    }
  };
  getHeaderTitle = () => {
    const { toastType, header } = this.props;
    if (header) {
      return header;
    }
    if (toastType === Toast.Type.NEUTRAL) {
      return null;
    }
    return toastType.charAt(0).toUpperCase() + toastType.slice(1).toLowerCase();
  };

  onCancelClick = () => {
    this.setState(
      {
        animationEndClass: "leaving",
      },
      () => {
        setTimeout(() => {
          this.setState({
            animationEndClass: "",
          });
          this.props.onCancel();
        }, 250);
      }
    );
  };

  renderConent = () => {
    const { toastType } = this.props;
    const title = this.getHeaderTitle();
    let content = null;
    if (toastType !== Toast.Type.NEUTRAL) {
      content = <div className={"toast-content"}>{this.props.content}</div>;
    } else {
      content = (
        <div className="netural-content">
          <div className={"toast-content"}>{this.props.content}</div>
          {!title && !this.props.autoHide && (
            <div>
              <AppIcon
                onClick={this.onCancelClick}
                ctrCls="toast-header-close icon-toast-cls"
                iconCls="icon-close-toast"
              ></AppIcon>
            </div>
          )}
        </div>
      );
    }
    return content;
  };

  render() {
    const positionCls = this.getPositionClass();
    const toastTypeCls = this.getTypeClass();
    const title = this.getHeaderTitle();
    return (
      <Transition timeout={CONSTANTS.ANIMATION_SPEED} in={true} appear>
        {(status) => (
          <div
            id={this.props.name}
            className={`toast-ctr v2 ${positionCls} ${toastTypeCls} ${this.props.ctrCls} ${status} ${this.state.animationEndClass}`}
          >
            {title && (
              <div className={"toast-header"}>
                {this.getHeadIcon()}
                <div className="toast-header-title"> {title} </div>
                {!this.props.autoHide && (
                  <AppIcon
                    onClick={this.onCancelClick}
                    ctrCls="icon-toast-cls toast-header-close"
                    iconCls="icon-close-toast"
                  ></AppIcon>
                )}
              </div>
            )}
            {this.renderConent()}
          </div>
        )}
      </Transition>
    );
  }
}
Toast.Position = {
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_LEFT: "BOTTOM_LEFT",
  TOP_LEFT: "TOP_LEFT",
  TOP_RIGHT: "TOP_RIGHT",
  TOP_CENTER: "TOP_CENTER",
  BOTTOM_CENTER: "BOTTOM_CENTER",
};

Toast.Type = {
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
  WARN: "WARN",
  INFO: "INFO",
  NEUTRAL: "NEUTRAL",
};

Toast.defaultProps = {
  ctrCls: "",
  header: "",
  toastType: Toast.Type.SUCCESS,
  position: Toast.Position.BOTTOM_RIGHT,
  autoHide: false,
  onCancel: () => {},
  name: "",
};

Toast.propTypes = {
  /**
   *  name identification of the toast
   */
  name: PropTypes.string.isRequired,
  /**
   * message to display in toast
   */
  content: PropTypes.any,
  /**
   * Specify ctrCls for the Toast class name
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the position toast apper
   */
  position: PropTypes.oneOf([
    "BOTTOM_CENTER",
    "BOTTOM_LEFT",
    "TOP_LEFT",
    "BOTTOM_RIGHT",
    "TOP_CENTER",
    "TOP_RIGHT",
  ]),
  /**
   * close toast after 1sec automatically
   */
  autoHide: PropTypes.bool,
  /**
   * toast header
   */
  header: PropTypes.string,

  toastType: PropTypes.oneOf(["SUCCESS", "WARN", "FAIL", "INFO", "NEUTRAL"]),
  /**
   * event trigger on close
   */
  onCancel: PropTypes.func,
  /**
   * close toast automatically with timeoue 1s = 1000
   */
  autoHideTimeOut: PropTypes.number,
};

export default Toast;
