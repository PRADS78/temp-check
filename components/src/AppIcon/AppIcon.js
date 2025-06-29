import "./AppIcon.scss";

const AppIcon = (props) => {
  const isSvgLoaded = () => {
    if (sessionStorage.getItem("isSvgFileLoaded") !== "true") {
      sessionStorage.setItem("isSvgFileLoaded", "true");
      return false;
    }
    return true;
  };
  var iconStyle = {};
  if (props.iconColor) {
    iconStyle = { fill: props.iconColor };
  }

  return (
    <>
      <svg
        onClick={props.onClick}
        className={`app-icon v2 ${props.ctrCls}`}
        style={iconStyle}
        key={3}
        role="img"
      >
        <use xlinkHref={`#${props.iconCls}`} />
      </svg>
    </>
  );
};
AppIcon.defaultProps = {
  ctrCls: "",
  onClick: () => {},
};

export default AppIcon;
