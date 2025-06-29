import Badges from "./Badges";
import { Sort as TableSort } from "@disprz/icons";

const storyConfig = {
  title: "Disprz/DisprzBadges",
  component: Badges,
};

export default storyConfig;

function Template(args) {
  return (
    <div
      id="badges-container"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Badges {...args}>{args.children}</Badges>
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  children: (
    <TableSort className="" style={{ stroke: "rgba(0, 0, 0, 0.65)" }} />
  ),
};

export const Numbered = Template.bind({});
Numbered.args = {
  ...Standard.args,
  count: 1,
};

export const MaxNumber = Template.bind({});
MaxNumber.args = {
  ...Standard.args,
  count: 1000,
};

export const Inline = Template.bind({});
Inline.args = {
  ...Standard.args,
  count: 10,
  isInline: true,
};
