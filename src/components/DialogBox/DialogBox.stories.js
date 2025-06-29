import { useArgs } from "@storybook/client-api";
import { PrimaryButton } from "../../components/AppButton";
import { DialogBox } from ".";
import { DatePicker } from "../DatePicker";

const storyConfig = {
  title: "Disprz/DisprzDialogBox",
  component: DialogBox,
};

export default storyConfig;

function Template(args) {
  const [{ isVisible }, updateArgs] = useArgs();
  const toggleButtonStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
  };
  const dialogBoxBodyStyle = {
    width: "320px",
  };
  const onDismiss = () => {
    updateArgs({ isVisible: false });
  };

  return (
    <div data-testid="dialog-box-container">
      <DialogBox
        {...args}
        onDismissDialogBox={args.onDismissDialogBox ?? onDismiss}
        isVisible={isVisible}
        style={dialogBoxBodyStyle}
        uniqueId={"1666938394758"}
      />
      <div style={toggleButtonStyle}>
        <PrimaryButton
          label="Toggle"
          onClick={() => updateArgs({ isVisible: !isVisible })}
          ctrCls="toggleButton"
          uniqueId={"1666938474214"}
        />
      </div>
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  title: "Notice",
  isVisible: true,
  content: `
    "If I have seen further it is by standing on the shoulders of giants."
    `,
  onCloseButtonClick: () => {
    console.log("close button click!");
  },
  onOkButtonClick: () => {
    console.log("ok button has been clicked");
  },
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  title: null,
  isVisible: false,
  content: `
    "No man burdens his mind with small matters unless he has some very good reason for doing so."
    `,
  onCloseButtonClick: () => {
    console.log("close button click!");
  },
  onOkButtonClick: () => {
    console.log("ok button has been clicked");
  },
};

export const CustomContent = Template.bind({});
CustomContent.args = {
  title: "Custom Content",
  isVisible: true,
  content: (
    <div>
      <DatePicker
        label="Starting Date"
        name="date"
        onChange={() => console.log("date changed")}
        uniqueId={"1666938474214"}
      />
    </div>
  ),
  onCloseButtonClick: () => {
    console.log("close button click!");
  },
  onOkButtonClick: () => {
    console.log("ok button has been clicked");
  },
};

export const DisabledActionButtons = Template.bind({});
DisabledActionButtons.args = {
  ...Standard.args,
  isDisabledCancelButton: true,
  isDisabledOkButton: true,
};

const parameters = {
  jest: ["DialogBox.test.js"],
};

Standard.parameters =
  WithoutTitle.parameters =
  CustomContent.parameters =
  DisabledActionButtons.parameters =
    parameters;
