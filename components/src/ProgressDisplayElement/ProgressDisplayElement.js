import { Component } from "react";
import PropTypes from "prop-types";

import * as Utils from "../Utils";
let ProgressBar = require("progressbar.js");

/**
 * @deprecated
 */
class ProgressDisplayElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressBar: null,
      progressValue: this.props.value < 0 ? 100 : this.props.value,
    };
  }
  componentDidMount() {
    let element = document.querySelector(`#progressElement-${this.props.name}`);
    this.setState(
      {
        element,
      },
      () => {
        this.setUpConfig();
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState(
      {
        progressValue: nextProps.value < 0 ? 100 : nextProps.value,
      },
      () => {
        this.setUpConfig();
      }
    );
  }
  componentWillUnmount() {
    if (this.state.progressBar) {
      this.state.progressBar.destroy();
    }
  }

  render() {
    let elementCls = "";
    if (this.props.progressElementType === "Circle") {
      elementCls = "progress-circle ";
    } else if (this.props.progressElementType === "SemiCircle") {
      elementCls = "progress-bar ";
    } else if (this.props.progressElementType === "Line") {
      elementCls = "progress-line ";
    }

    return (
      <div
        key={`progressElement-${this.props.name}`}
        className={this.props.ctrCls}
      >
        <div
          id={`progressElement-${this.props.name}`}
          className={elementCls + this.props.elementCls}
          data-value={this.state.progressValue}
        ></div>
      </div>
    );
  }

  setUpConfig = () => {
    let currentTheme = Utils.getNeturalThemeColors();
    let accentColor = this.props.setCompletionAccents
      ? this.getCompletionColorAccent(this.props.value)
      : this.props.trailAccentColor;
    let config = {
        strokeWidth: this.props.strokeWidth,
        easing: "easeInOut",
        duration: this.props.animationDuration,
        color: this.props.setCompletionAccents
          ? currentTheme[accentColor] || this.props.trailAccentColor
          : this.props.trailAccentColor,
        trailColor: this.props.trailColor,
        trailWidth: this.props.trailWidth,
      },
      heightWidthConfig = {
        svgStyle: {
          height: this.props.height + "px",
          width: this.props.width + "px",
        },
      };

    let constructor = "";
    if (this.props.progressElementType === "Circle") {
      constructor = ProgressBar.Circle;
      Object.assign(config, heightWidthConfig);
    } else if (this.props.progressElementType === "SemiCircle") {
      constructor = ProgressBar.SemiCircle;
    } else if (this.props.progressElementType === "Line") {
      let leftSpacing = "";
      let transform = "";
      let textColor = "";
      if (this.props.value >= 75 || this.props.value < 0) {
        leftSpacing = "50%";
        transform = "translate(-50%, -50%)";
        textColor = "#fff";
      } else if (this.props.value < 75) {
        leftSpacing = `${this.props.value}%`;
        transform = "translate(20%, -50%)";
        textColor = config.color;
      }
      let lineTextConfig = {
        strokeWidth: this.props.strokeWidth,
        trailWidth: this.props.trailWidth,
        strokeLinecap: "round",
        text: {
          style: {
            color: textColor,
            position: "absolute",
            left: leftSpacing,
            top: "50%",
            padding: "0px",
            margin: "0px",
            transform: transform,
          },
        },
      };
      constructor = ProgressBar.Line;
      Object.assign(config, lineTextConfig);
    }
    let bar = new constructor(this.state.element, config);

    if (this.state.progressBar) {
      this.state.progressBar.destroy();
    }

    this.setState(
      {
        progressBar: bar,
      },
      () => {
        this.updateFeedbackProgressBar();
      }
    );
  };
  updateFeedbackProgressBar = () => {
    let fraction =
      parseInt(this.state.element?.getAttribute("data-value")) / 100;
    let canSetText = this.props.setPercentageValue;

    let textValue = this.props.textValue;
    let value = this.props.value;
    let progressBar = this.state.progressBar;
    this.state.progressBar.animate(fraction, {
      duration: 250,
      step: (state, circle) => {
        console.log({ state });
        console.log({ circle });
        if (textValue != null) {
          circle.setText(textValue);
        } else if (canSetText) {
          circle.setText(
            parseInt(this.state.element.getAttribute("data-value")) + "%"
          );
        }
        if (value === 100) {
          progressBar.trail.setAttribute("stroke", "#5cb85c");
          progressBar.path.setAttribute("stroke", "#5cb85c");
        }
      },
    });
    this.state.progressBar.trail.setAttribute("stroke-linecap", "round");
    this.state.progressBar.path.setAttribute("stroke-linecap", "round");
  };
  getCompletionColorAccent = (value) => {
    let colorAccent = "themeNeutral4";
    if (value <= 30) {
      colorAccent = "themeNeutral3";
    } else if (value > 30 && value <= 70) {
      colorAccent = "themeNeutral2";
    }
    return colorAccent;
  };
}

ProgressDisplayElement.Type = {
  CIRCLE: "Circle",
  LINE: "Line",
  SEMICIRCLE: "SemiCircle",
};

ProgressDisplayElement.propTypes = {
  /**
   *  name identification of the toast
   */
  name: PropTypes.string.isRequired,
  /**
   * strokeWidth of the progress bar
   */
  strokeWidth: PropTypes.number,
  /**
   * height of the progress bar
   */
  height: PropTypes.number,
  /**
   * width of the progress bar
   */
  width: PropTypes.number,
  /**
   * Specify ctrCls for the progress bar class name
   */
  ctrCls: PropTypes.string,
  /**
   * Specify the type of  progress bar
   */
  progressElementType: PropTypes.oneOf(["Circle", "Line", "SemiCircle"]),
  /**
   * animation Duration of progress bar
   */
  animationDuration: PropTypes.number,
  /**
   * show percentage on progress bar
   */
  setPercentageValue: PropTypes.bool,
  /**
   * set setCompletionAccents on progress bar
   */
  setCompletionAccents: PropTypes.bool,
  /**
   * set trailColor on progress bar
   */
  trailColor: PropTypes.string,
  /**
   * set elementCls in progress bar
   */
  elementCls: PropTypes.string,
  /**
   * set value of progress bar
   */
  value: PropTypes.number,
  /**
   * set textValue of progress bar
   */
  textValue: PropTypes.string,
  /**
   * set setCompletionAccents is false then trailAccent will set of progress bar
   */
  trailAccentColor: PropTypes.string,
};

ProgressDisplayElement.defaultProps = {
  strokeWidth: 10,
  height: 50,
  width: 50,
  progressElementType: "Circle",
  animationDuration: 1500,
  setCompletionAccents: true,
  elementCls: "",
  trailColor: "#eee",
  trailAccentColor: "#0072bc",
  ctrCls: "",
  setPercentageValue: true,
  textValue: null,
  value: 0,
  name: "progress_id",
};

export default ProgressDisplayElement;
