import { Component, createContext } from "react";
import * as Utils from "../Utils";
import chroma from "chroma-js"

class ThemeProvider extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let themeColor = this.props.themeColor;
    let rgb = Utils.hexToRgb(themeColor);

    let css = `:root { `;
    css += `--accent: ${themeColor};`;
    css += `--accentVeryLight: ${Utils.lightenDarkenColor(themeColor, 40)};`;
    css += `--accentLight: ${Utils.lightenDarkenColor(themeColor, 20)};`;
    css += `--accentLight2: ${chroma(themeColor).alpha(0.74).hex()};`;
    css += `--accentLight4: ${chroma(themeColor).alpha(0.04).hex()};`;
    css += `--accentHoverLight: rgb(${rgb.r * 0.08 + 255 * (1 - 0.08)}, ${rgb.g * 0.08 + 255 * (1 - 0.08)}, ${rgb.b * 0.08 + 255 * (1 - 0.08)});`; // Converting a rgba to rgb without alpha
    css += `--accentDark: ${Utils.lightenDarkenColor(themeColor, -20)};`;
    css += `--accentTranslucent: rgba(${rgb.r},${rgb.g},${rgb.b}, 0.6);`;
    css += `--accentMildLight: rgba(${rgb.r},${rgb.g},${rgb.b}, 0.12);`;
    css += `--accentVeryMildLight: rgba(${rgb.r},${rgb.g},${rgb.b}, 0.06);`;
    css += `}`;
    Utils.appendStyle(css);
  }

  render() {
    // TODO: Remove ThemeProvider as there is no use of ThemeContext
    return <themeContext.Provider value={""}>{this.props.children}</themeContext.Provider>;
  }
}

export const themeContext = createContext();

export default ThemeProvider;
