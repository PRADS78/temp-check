import { Component } from "react";
import PropTypes from "prop-types";
import "./Checkbox.scss";

/**
 * @deprecated
 */
class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationEndClass: "",
      checked: this.props.value,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.checked) {
      this.setState({
        checked: nextProps.value,
      });
    }
  }

  render() {
    var activeCls = this.state.checked ? "active" : "";
    var isDisabled = this.props.disabled || this.props.readonly;
    var readOnlyCls = isDisabled ? "checkbox-readonly" : "";
    return (
      <div
        className={`checkbox-ctr v2 ${this.props.ctrCls} ${activeCls} ${readOnlyCls}`}
        onClick={this.toggleCheckbox}
        data-testid="checkbox"
      >
        <input
          type="checkbox"
          onChange={() => {}}
          name={this.props.name}
          checked={this.state.checked}
        />
        <div className={"checkbox-btn"}>
          {this.state.checked && (
            <svg className={`app-icon `} data-testid="app-icon">
              <use xlinkHref={`#icon-app-correct`} />
            </svg>
          )}
        </div>
        {this.props.label && (
          <div className={"checkbox-label"}>{this.props.label}</div>
        )}
      </div>
    );
  }

  toggleCheckbox = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        checked: !this.state.checked,
      },
      () => {
        this.props.onChange(this.state.checked, this.props.data);
      }
    );
  };
}

Checkbox.defaultProps = {
  label: "",
  ctrCls: "",
  onChange: () => {},
  name: "checkbox",
};

Checkbox.propTypes = {
  /**
   * Specify ctrCls for the chackbox parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * define name for the input indentity
   */
  name: PropTypes.string,
  /**
   * Specify label text for check box
   */
  label: PropTypes.string,
  /**
   * onChange it's function for the checkbox change method
   */
  onChange: PropTypes.func,
};

export default Checkbox;
