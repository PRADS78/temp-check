// DialogControl.stories.js
import DialogControl from "../DialogControl/DialogControl";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";

export default {
  title: "Deprecated/DialogControl",
  component: DialogControl,
  name: "DialogControl",
  decorators: [(story) => story()],
};

const Template = (args) => {
  return (
    <>
      <AppIcon />
      <DialogControl {...args} />
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  ctrCls: "",
  title: "Title",
  content: "",
  showCloseButton: true,
  showHeaderCloseButton: true,
  showOkButton: true,
  okButtonLabel: "Okay",
  closeButtonLabel: "Close",
  actionButtons: [],
  onCloseButtonClick: function () {},
  onOkButtonClick: function () {},
};

Basic.parameters = {
  jest: {
    disable: true,
  },
};
