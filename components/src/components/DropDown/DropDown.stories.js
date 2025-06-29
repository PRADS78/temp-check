import { DropDown } from ".";
import { DropDownPosition, DropDownOptionTypes } from "../../Enums";

const storyConfig = {
  title: "Disprz/DisprzDropDown",
  component: DropDown,
  layout: "centered",
};

export default storyConfig;

function Template(args) {
  const templateStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "450px",
    width: "300px",
    padding: "10px",
  };

  return (
    <div style={templateStyle} data-testid="drop-down-container">
      <DropDown {...args} uniqueId={1666947238143} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  placeholder: "Select flavor",
  name: "drop-down",
  items: [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ],
  ctrCls: "",
  isClearable: false,
  isSearchable: true,
  isMulti: false,
  isDisabled: false,
};

export const Grouped = Template.bind({});
Grouped.args = {
  placeholder: "Select flavor",
  name: "drop-down",
  items: [
    { value: "sundae-pie", label: "Sundae pie", groupTitle: "sweets" },
    { value: "oreo-shake", label: "Oreo shake", groupTitle: "sweets" },
    { value: "soft-serve", label: "Soft serve", groupTitle: "sweets" },
    { value: "vanilla-shake", label: "Vanilla shake", groupTitle: "sweets" },

    { value: "sprite", label: "Sprite", groupTitle: "drinks" },
    { value: "coke", label: "Coke", groupTitle: "drinks" },
    { value: "barq's", label: "Barq's", groupTitle: "drinks" },

    { value: "chicken-fries", label: "Chicken fries", groupTitle: "chicken" },
    { value: "big-fish", label: "Big fish", groupTitle: "chicken" },
    { value: "spicy-chicken", label: "Spicy chicken", groupTitle: "chicken" },

    {
      groupTitle: "sides",
      value: "french-fries",
      label: "French fries",
    },
    {
      groupTitle: "sides",
      value: "chicken-nuggets",
      label: "Chicken nuggets",
    },
    {
      groupTitle: "sides",
      value: "chicken-strips",
      label: "Chicken strips",
    },
  ],
  ctrCls: "",
  isClearable: false,
  isSearchable: true,
  isMulti: false,
  isDisabled: false,
  position: DropDownPosition.BOTTOM,
  itemsType: DropDownOptionTypes.GROUPED,
};

export const GroupedMultiSelection = Template.bind({});
GroupedMultiSelection.args = {
  placeholder: "Select items",
  name: "drop-down",
  items: [
    { value: "sundae-pie", label: "Sundae pie", groupTitle: "sweets" },
    { value: "oreo-shake", label: "Oreo shake", groupTitle: "sweets" },
    { value: "soft-serve", label: "Soft serve", groupTitle: "sweets" },

    { value: "sprite", label: "Sprite", groupTitle: "drinks" },
    { value: "coke", label: "Coke", groupTitle: "drinks" },
    { value: "barq's", label: "Barq's", groupTitle: "drinks" },

    { value: "ch'king", label: "Ch'King Sandwich", groupTitle: "chicken" },
    { value: "chicken-fries", label: "Chicken fries", groupTitle: "chicken" },
    { value: "big-fish", label: "Big fish", groupTitle: "chicken" },
  ],
  ctrCls: "",
  isClearable: true,
  isSearchable: true,
  isMulti: true,
  isDisabled: false,
  itemsType: DropDownOptionTypes.GROUPED,
};

export const MultipleWithSearch = Template.bind({});
MultipleWithSearch.args = {
  placeholder: "Select flavor",
  name: "drop-down",
  items: [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "cheese", label: "Cheese" },
  ],
  ctrCls: "",
  isClearable: true,
  isSearchable: true,
  isMulti: true,
  isDisabled: false,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  placeholder: "Flavor",
  name: "drop-down",
  items: [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ],
  ctrCls: "",
  isClearable: false,
  isSearchable: false,
  isMulti: false,
  isDisabled: false,
  label: "Select",
};

export const CustomizedSelectedLabel = Template.bind({});
CustomizedSelectedLabel.args = {
  ...Standard.args,
  items: [
    {
      value: "chocolate",
      label: "Chocolate",
      selectedLabel: <span>Choco</span>,
    },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ],
};

export const TopPosition = Template.bind({});
TopPosition.args = {
  ...Standard.args,
  position: DropDownPosition.TOP,
};

export const CustomizedMaxHeight = Template.bind({});
CustomizedMaxHeight.args = {
  ...GroupedMultiSelection.args,
  maxHeight: 300,
};

export const DisabledSingleSelection = Template.bind({});
DisabledSingleSelection.args = {
  ...Standard.args,
  items: [
    { value: "chocolate", label: "Chocolate", isDisabled: true },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ],
};

export const DisabledGroupedMultiSelection = Template.bind({});
DisabledGroupedMultiSelection.args = {
  ...GroupedMultiSelection.args,
  items: [
    {
      value: "sundae-pie",
      label: "Sundae pie",
      groupTitle: "sweets",
    },
    { value: "oreo-shake", label: "Oreo shake", groupTitle: "sweets" },
    { value: "soft-serve", label: "Soft serve", groupTitle: "sweets" },

    { value: "sprite", label: "Sprite", groupTitle: "drinks" },
    { value: "coke", label: "Coke", groupTitle: "drinks" },
    { value: "barq's", label: "Barq's", groupTitle: "drinks" },

    {
      value: "ch'king",
      label: "Ch'King Sandwich",
      groupTitle: "chicken",
      isDisabled: true,
    },
    { value: "chicken-fries", label: "Chicken fries", groupTitle: "chicken" },
    { value: "big-fish", label: "Big fish", groupTitle: "chicken" },
  ],
};

const parameters = {
  jest: ["DropDown.test.js"],
};

Standard.parameters =
  Grouped.parameters =
  GroupedMultiSelection.parameters =
  MultipleWithSearch.parameters =
    parameters;
