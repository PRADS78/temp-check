const CenterMessageDisplay = ({ ctrCls, message, showSpinner }) => {
  return (
    <div className={ctrCls || ""}>
      <div className="text-center center-message">
        {showSpinner ? <div className="loading-spinner" /> : ""}
        {showSpinner ? <br /> : ""}
        {message}
      </div>
    </div>
  );
};

export default CenterMessageDisplay;
