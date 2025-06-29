// Checkbox.stories.js
import Toast from "../Toast/Toast";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/Toast",
  component: Toast,
  name: "Toast",
  decorators: [(story) => story()],
  argTypes: {
    onChange: { action: "checked" },
  },
};

const Template = (args) => (
  <>
    <AppIcon />
    <Toast {...args} />
  </>
);

export const BottomRight = Template.bind({});
export const TopRight = Template.bind({});
export const TopCenter = Template.bind({});
export const TopRightWithHtmlContent = Template.bind({});
TopRight.args = {
  ctrCls: "",
  position: Toast.Position.TOP_RIGHT,
  toastType: Toast.Type.SUCCESS,
  content: "Successfully saved",
  name: "success_toast",
};
TopRightWithHtmlContent.args = {
  ctrCls: "",
  position: Toast.Position.TOP_RIGHT,
  toastType: Toast.Type.SUCCESS,
  content: (
    <b>
      Hi iam <span style={{ color: "red" }}>html content</span>
    </b>
  ),
  name: "success_toast_html",
};
BottomRight.args = {
  ctrCls: "",
  header: "Failed",
  position: Toast.Position.BOTTOM_RIGHT,
  toastType: Toast.Type.FAIL,
  autoHide: true,
  content: <b>Test</b>,
  name: "fail_toast",
};
TopCenter.args = {
  ctrCls: "test",
  header: "Auto close",
  content: "close auto after 5 sec",
  position: Toast.Position.BOTTOM_RIGHT,
  toastType: Toast.Type.INFO,
  autoHide: true,
  autoHideTimeOut: 5000,
  name: "auto_toast",
};
