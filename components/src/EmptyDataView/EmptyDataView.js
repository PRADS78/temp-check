import { Component } from "react";
import AppButton from "../AppButton/AppButton";
import AppIcon from "../AppIcon/AppIcon";
import "./EmptyDataView.scss";
class EmptyDataView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let msg =
      this.props.displayMsg ||
      `You don't have any ${this.props.displayType}...!`;
    let addButton = "";
    if (this.props.displayAddBtn) {
      addButton = (
        <AppButton
          buttonLabel={this.props.btnLabel || "common.addYourFirst"}
          buttonCls="add-button"
          buttonIconCls={this.props.btnIconCls || "icon-add2"}
          clickHandler={this.props.onAdd}
        />
      );
    }

    return (
      <div className={"empty-data-view-ctr v2 " + this.props.ctrCls}>
        {this.props.showLoader && <div className="animated-spinner-2" />}
        <div className="summary-text text-center">{msg}</div>
        <div className={"buttons-ctr"}>
          {addButton}
          {/*{this.props.helpVideoLink ? <SkilltronUI.util.PlatformHelpTrigger helpVideoLink={this.props.helpVideoLink} /> : ""}*/}
        </div>
      </div>
    );
  }
}
EmptyDataView.defaultProps = {
  displayMsg: "",
  displayType: "",
  displayAddBtn: false,
  ctrCls: "",
  showLoader: false,
  onAdd: () => void 0,
  btnLabel: "",
  btnIconCls: "",
  helpVideoLink: "",
};

export default EmptyDataView;
