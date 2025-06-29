import { Component } from "react";
import ReactDOM from "react-dom";
import "./ProgressToast.scss";
class ProgressToast extends Component {
  constructor(props) {
    super(props);
    this.toastEle = null;
  }
  componentDidMount() {
    let ele =
      this.props.portalId && document.getElementById(this.props.portalId);
    if (!ele) {
      ele = document.createElement("div");
      ele.id = this.props.portalId || "exportProcess";
      document.body.appendChild(ele);
    }
    this.toastEle = ele;
    this.componentDidUpdate();
  }
  componentDidUpdate() {
    ReactDOM.render(
      <div className={`progress-toast-ele ${this.props.ctrCls}`}>
        {this.props.children}
      </div>,
      this.toastEle
    );
  }
  destroy() {
    if (this.toastEle) {
      document.body.removeChild(this.toastEle);
    }
  }
  render() {
    return null;
  }
}

ProgressToast.defaultProps = {
  ctrCls: "",
};
export default ProgressToast;
