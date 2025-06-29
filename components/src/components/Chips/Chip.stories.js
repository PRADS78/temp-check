import { ChipSelectionType, Size } from "../../Enums";
import { faker } from "@faker-js/faker/locale/en";

import Chip from "./Chip";
const storyConfig = {
  title: "Disprz/DisprzChip",
  component: Chip,
};

export default storyConfig;

function Template(args) {
  return (
    <div data-testid="chip">
      <Chip {...args} uniqueId={1670905873158} />
    </div>
  );
}

function TemplateChoiceChip(args) {
  const chipContainer = {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  };

  return (
    <div data-testid="chip" style={chipContainer}>
      <Chip {...args} uniqueId={1670905901762} label="Option1" selectedId={1} />
      <Chip
        {...args}
        uniqueId={1670905923829}
        label="Option2"
        isSelected={true}
        selectedId={2}
      />
      <Chip {...args} uniqueId={1670905949325} label="Option3" selectedId={3} />
      <Chip {...args} uniqueId={1670905971402} label="Option4" selectedId={4} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  ctrCls: "",
  label: "Enabled",
  size: Size.SMALL,
  onClick: () => {
    console.log("This Is Onclick");
  },
};

export const WithClose = Template.bind({});
WithClose.args = {
  ...Standard.args,
  canShowClose: true,
  onClose: () => {
    console.log("This Is Onclose");
  },
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  ...Standard.args,
  canShowAvatar: true,
  avatarUrl: faker.image.avatar(),
};

export const LargeChip = Template.bind({});
LargeChip.args = {
  ...Standard.args,
  canShowClose: true,
  onClose: () => {
    console.log("This Is Onclose");
  },
  size: Size.LARGE,
};

export const SingleChoice = TemplateChoiceChip.bind({});
SingleChoice.args = {
  ctrCls: "",
  size: Size.SMALL,
  selectionType: ChipSelectionType.SINGLE,
};

export const MultipleChoice = TemplateChoiceChip.bind({});
MultipleChoice.args = {
  ...Standard.args,
  selectionType: ChipSelectionType.MULTI,
};
