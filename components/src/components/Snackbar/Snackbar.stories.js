import Snackbar from "./Snackbar";
import { PrimaryButton } from "../AppButton";
import { useRef } from "react";
import { SnackBarDuration } from "../../Enums";

const storyConfig = {
  title: "Disprz/DisprzSnackbar",
  component: Snackbar,
};

export default storyConfig;

function Template(args) {
  const standardSnackRef = useRef(null);
  return (
    <div data-testid="snack-bar-container">
      <Snackbar ref={standardSnackRef} {...args} uniqueId={1666951581177} />
      <div style={{ display: "flex" }}>
        <div style={{ "padding-right": "20px" }}>
          <PrimaryButton
            label="Show"
            ctrCls={"showButton"}
            onClick={() => {
              standardSnackRef.current.show();
            }}
            uniqueId={1666951559648}
          />
        </div>
        <PrimaryButton
          label="Hide"
          ctrCls={"hideButton"}
          onClick={() => {
            standardSnackRef.current.hide().then(() => {
              console.log("Clicked");
            });
          }}
          uniqueId={1666951567409}
        />
      </div>
    </div>
  );
}

export const Basic = Template.bind({});
Basic.args = {
  message: "This is the message for the warning box",
  ctrCls: "",
};

export const Action = Template.bind({});
Action.args = {
  action: {
    label: "Undo",
    onClick: function () {
      console.log("first");
    },
  },
  message: "This is the message for the warning box",
  canShowDismiss: false,
  ctrCls: "",
};

export const ActionDismiss = Template.bind({});
ActionDismiss.args = {
  action: { label: "Undo", onClick: function () {} },
  message: "This is the message for the warning box",
  canShowDismiss: true,
};

export const MessageType = Template.bind({});
MessageType.args = {
  message:
    "Two lines text string. One to two lines is preferable on mobile and tablet.",
  type: "warning",
  ctrCls: "",
};

export const MessageTypeWithCustomTitle = Template.bind({});
MessageTypeWithCustomTitle.args = {
  message:
    "Two lines text string. One to two lines is preferable on mobile and tablet.",
  type: "error",
  ctrCls: "",
  title: "Whoops!",
};

export const ShortDurationSnackbar = Template.bind({});
ShortDurationSnackbar.args = {
  message: "Snackbar with a duration of 1750 milliseconds",
  duration: SnackBarDuration.SHORT,
  ctrCls: "",
};

export const LongDurationSnackbar = Template.bind({});
LongDurationSnackbar.args = {
  message: "Snackbar with a duration of 2750 milliseconds",
  duration: SnackBarDuration.LONG,
  ctrCls: "",
};

export const IndefiniteDurationSnackbar = Template.bind({});
IndefiniteDurationSnackbar.args = {
  ...ActionDismiss.args,
  message: "Snackbar with no duration",
  duration: SnackBarDuration.INDEFINITE,
  ctrCls: "",
};

const parameters = {
  jest: ["Snackbar.test.js"],
};

Basic.parameters =
  Action.parameters =
  ActionDismiss.parameters =
  MessageType.parameters =
  MessageTypeWithCustomTitle.parameters =
    parameters;
