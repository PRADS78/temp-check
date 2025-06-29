import { TagColor } from "../../Enums";
import Tag from "./Tag";
const storyConfig = {
  title: "Disprz/DisprzTag",
  component: Tag,
};

export default storyConfig;

function Template(args) {
  return (
    <div data-testid="tag">
      <Tag uniqueId={1670820739417} {...args} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  ctrCls: "",
  label: "Completed",
  color: TagColor.DEFAULT,
};

export const Rating = Template.bind({});
Rating.args = {
  label: "4/5",
  color: TagColor.PRIMARY,
};
