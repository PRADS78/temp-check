import { Component } from "react";

class LocalizedOverlay extends Component {
  render() {
    return (
      <div
        className={`local-overlay center-message text-center ${this.props.ctrCls}`}
      >
        {this.props.children}
      </div>
    );
  }
}
LocalizedOverlay.defaultProps = {
  ctrCls: "",
};
export default LocalizedOverlay;
