import { Label } from ".";
import { TextArea } from "../TextArea";
const storyConfig = {
  title: "Disprz/DisprzLabel",
  component: Label,
};

export default storyConfig;

function Template(args) {
  const templateStyle = { padding: "15px", width: "400px" };
  return (
    <div data-testid="label-container" style={templateStyle}>
      <Label {...args} uniqueId={1667225984211} />
      <TextArea uniqueId={1667226034359} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  text: "Description",
  isRequired: true,
  helpText: "helping Text",
};
