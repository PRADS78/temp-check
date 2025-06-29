import { Component } from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
import AppButton from "../AppButton/AppButton";
import "./DialogControl.scss";
import CONSTANTS from "../Constants";

/**
 * @deprecated
 */
class DialogControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationEndClass: "",
      showButtonLoader: false,
      disableOkButton: false,
    };
  }
  showLoader = () => {
    this.setState({
      showButtonLoader: true,
      disableOkButton: true,
    });
  };
  render() {
    let actionButtons = [];
    if (this.props.actionButtons.length) {
      actionButtons = this.props.actionButtons;
    } else {
      if (this.props.showCloseButton) {
        actionButtons.push(
          <AppButton
            key={"closeButton"}
            clickHandler={this.onCloseButtonClick}
            buttonLabel={this.props.closeButtonLabel}
            type="outlined"
          />
        );
      }
      if (this.props.showOkButton) {
        actionButtons.push(
          <AppButton
            key={"okButton"}
            disabled={this.state.disableOkButton}
            clickHandler={this.onOkButtonClick}
            buttonLabel={this.props.okButtonLabel}
          >
            {this.state.showButtonLoader && (
              <div className={"loading-spinner"} />
            )}
          </AppButton>
        );
      }
    }
    return (
      <Transition timeout={CONSTANTS.ANIMATION_SPEED} in={true} appear>
        {(status) => (
          <div
            className={`local-overlay  v2 disprz-dg-ctr ${status} ${this.state.animationEndClass} ${this.props.ctrCls}`}
          >
            <div className={"dialog-component "}>
              {!!this.props.title && (
                <div className={"title"}>{this.props.title}</div>
              )}
              {this.props.showHeaderCloseButton && (
                <AppButton
                  ctrCls={"close"}
                  clickHandler={this.onCloseButtonClick}
                  buttonIconCls={"icon-wrong"}
                  type="plain"
                />
              )}
              <div className={"dialog-body"}>
                {this.props.content}
                {this.props.htmlContent}
                {this.props.children}
              </div>
              <div className={"footer"}>{actionButtons}</div>
            </div>
          </div>
        )}
      </Transition>
    );
  }

  onOkButtonClick = () => {
    this.props.onOkButtonClick();
  };
  onCloseButtonClick = () => {
    this.setState(
      {
        animationEndClass: "leaving",
      },
      () => {
        setTimeout(() => {
          this.setState({
            animationEndClass: "",
          });
          this.props.onCloseButtonClick();
        }, 250);
      }
    );
  };
}

DialogControl.defaultProps = {
  ctrCls: "",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  showCloseButton: false,
  htmlContent: <></>,
  showHeaderCloseButton: false,
  showOkButton: true,
  okButtonLabel: "Okay",
  closeButtonLabel: "Close",
  actionButtons: [],
  onCloseButtonClick: function () {},
  onOkButtonClick: function () {},
};

DialogControl.propTypes = {
  /**
   * Specify ctrCls for the DialogControl class name
   **/
  ctrCls: PropTypes.string,
  /**
   * give the string content for the dialog as content props
   **/
  content: PropTypes.any,
  /**
   * give the html content for the dialog as htmlContent props
   **/
  htmlContent: PropTypes.element,
  /**
   * Specify showCloseButton boolean value either true or false for the DialogControl bottom close button
   **/
  showCloseButton: PropTypes.bool,
  /**
   * Specify showHeaderCloseButton boolean value either true or false for the DialogControl top close button
   **/
  showHeaderCloseButton: PropTypes.bool,
  /**
   * Specify showOkButton boolean value either true or false for the DialogControl submit button
   **/
  showOkButton: PropTypes.bool,
  /**
   * Specify okButtonLabel for the DialogControl submit button string value
   **/
  okButtonLabel: PropTypes.any,
  /**
   * Specify closeButtonLabel for the DialogControl bottom close button string value
   **/
  closeButtonLabel: PropTypes.any,
  /**
   * You can add more button for the DialogControl bottom section
   **/
  actionButtons: PropTypes.array,
  /**
   * define onCloseButtonClick function bottom close button
   **/
  onCloseButtonClick: PropTypes.func,
  /**
   * define onOkButtonClick function bottom submit button
   **/
  onOkButtonClick: PropTypes.func,
};

export default DialogControl;
