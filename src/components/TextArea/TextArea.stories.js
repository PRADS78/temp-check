import { useRef } from "react";
import { useEffect } from "react";
import { TextArea } from ".";
const storyConfig = {
  title: "Disprz/DisprzTextArea",
  component: TextArea,
};

export default storyConfig;

function Template(args) {
  const templateStyle = { padding: "15px", width: "400px" };
  const textAreaRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      textAreaRef.current?.focus();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div data-testid="text-area-container" style={templateStyle}>
      <TextArea {...args} uniqueId={1667213734947} ref={textAreaRef} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  maxLength: 50,
  placeholder: "Enter the text content here",
  title: "Title",
};

export const Limitless = Template.bind({});
Limitless.args = {
  placeholder: "Enter the text content here",
  title: "Title",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Standard.args,
  isDisabled: true,
};

export const MinHeight = Template.bind({});
MinHeight.args = {
  ...Standard.args,
  maxLength: 100,
  minHeight: 50,
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  ...Standard.args,
  initialValue:
    "It is a great advantage who they are to come out at any time. In the same way, the soul's responsibilities are forsaken by the desire of the desire for success in the desire to be the fault of the desire.",
  maxLength: undefined,
  errorMessage: "Invalid Answer",
};

const parameters = {
  jest: ["TextArea.test.js"],
};

Standard.parameters = parameters;
