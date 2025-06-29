import { PrimaryButton } from "../../components/AppButton";
import { AlertDialog } from ".";
import { useArgs } from "@storybook/client-api";
import { AlertDialogTypes } from "../../Enums";
const storyConfig = {
  title: "Disprz/DisprzAlertDialog",
  component: AlertDialog,
};

export default storyConfig;

function Template(args) {
  const [{ isVisible }, updateArgs] = useArgs();
  const toggleButtonStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "20",
  };
  return (
    <div data-testid="alert-dialog-container">
      <AlertDialog
        onDismiss={() => {
          updateArgs({ isVisible: !isVisible });
        }}
        {...args}
        uniqueId={1666017863437}
      />
      <div style={toggleButtonStyle}>
        <PrimaryButton
          label="Toggle Alert"
          onClick={() => updateArgs({ isVisible: !isVisible })}
          ctrCls="toggleButton"
          uniqueId={1666015942881}
        />
      </div>
      <div>Click the Toggle Button</div>
    </div>
  );
}

export const Success = Template.bind({});
Success.args = {
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat nunc, cursus accumsan, auctor laoreet eget. Feugiat enim commodo dolor ac nec, viverra. Eget aliquam turpis dictum risus, cursus.",
  isDismissible: true,
  negativeText: "Cancel",
  positiveText: "Confirm",
  title: "Success",
  isVisible: true,
};

export const Warning = Template.bind({});
Warning.args = {
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat nunc, cursus accumsan, auctor laoreet eget. Feugiat enim commodo dolor ac nec, viverra. Eget aliquam turpis dictum risus, cursus.",
  isDismissible: true,
  negativeText: "Cancel",
  positiveText: "Confirm",
  title: "Warning",
  isVisible: false,
  type: AlertDialogTypes.WARNING,
};

export const Error = Template.bind({});
Error.args = {
  content:
    "Gravity explains the motions of the planets, but it cannot explain who sets the planets in motion.",
  isDismissible: true,
  negativeText: "Cancel",
  title: "Error",
  isVisible: false,
  type: AlertDialogTypes.ERROR,
  positiveText: "Delete",
};

const parameters = {
  jest: ["AlertDialog.test.js"],
};

Success.parameters = parameters;
