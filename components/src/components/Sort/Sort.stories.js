import Sort from "./Sort";
import { useState } from "react";
import { SortOrder } from "../../Enums";

const storyConfig = {
  title: "Disprz/DisprzSort",
  component: Sort,
};

export default storyConfig;

const Template = (args) => {
  const [byValue, setByValue] = useState(args.by);
  const [orderValue, setOrderValue] = useState(args.order);
  const onSort =
    args.onSort ??
    function (by, order) {
      setByValue(by);
      setOrderValue(order);
    };

  return (
    <div data-testid="sort">
      <Sort
        {...args}
        onSort={onSort}
        by={byValue}
        order={orderValue}
        uniqueId={1670392545007}
      />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  menuCtrCls: "",
  items: [
    {
      label: "Popularity",
      id: 1,
    },
    {
      label: "Recently Accessed",
      id: 2,
    },
    {
      label: "Published Date",
      id: 3,
      asc: {
        // Not mandatory
        label: "Latest First",
        id: 101,
      },
      desc: {
        // Not mandatory
        label: "Oldest First",
        id: 102,
      },
    },
    {
      label: "Duration",
      id: 4,
      asc: {
        label: "Lowest First",
        id: 103,
      },
      desc: {
        label: "Highest First",
        id: 104,
      },
    },
    {
      label: "Name",
      id: 5,
      asc: {
        // Not mandatory
        label: "Latest First",
        id: 105,
      },
      desc: {
        // Not mandatory
        label: "Oldest First",
        id: 106,
      },
    },
  ],
};

export const DefaultSelected = Template.bind({});

DefaultSelected.args = {
  ...Standard.args,
  by: "3",
  order: SortOrder.ASCENDING,
};
