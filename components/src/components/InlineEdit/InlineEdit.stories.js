import { useRef, useState } from "react";
import { InlineEdit } from ".";
const storyConfig = {
  title: "Disprz/DisprzInlineEdit",
  component: InlineEdit,
};

export default storyConfig;

function Template(args) {
  const [value, setValue] = useState(args.value);

  const onSetValue = (e, textValue) => {
    setValue(textValue);
  };
  const inlineEditRef = useRef();
  const onSubmit = args.onSubmit ?? onSetValue;

  const templateStyle = { padding: "15px" };
  return (
    <div data-testid="label-container" style={templateStyle}>
      <InlineEdit
        {...args}
        ref={inlineEditRef}
        onSubmit={onSubmit}
        value={value}
        uniqueId={1669187285858}
      />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  value: "Sample Text",
  placeholder: "Enter Some Text",
};

const parameters = {
  jest: ["InlineEdit.test.js"],
};

Standard.parameters = parameters;
