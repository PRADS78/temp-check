import Container from "./Container";
import { TableFilterListSubTypes, TableFilterTypes } from "../../Enums";
import { useState } from "react";

const storyConfig = {
  title: "Disprz/DisprzFilter",
  component: Container,
};

export default storyConfig;

const Template = (args) => {
  const [selectedItems, setSelectedItems] = useState(args.selectedItems ?? {});

  const _onApply =
    args.onApply ??
    function (_args) {
      if (args.isNonDiscreteApplyButton) {
        const _selectedItems = Object.entries(_args).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value.selectedItem,
          }),
          {}
        );
        setSelectedItems(_selectedItems);
      } else {
        setSelectedItems((prevItems) => {
          return { ...prevItems, [_args.id]: _args.selectedItem };
        });
      }
    };

  const _onCancel =
    args.onCancel ??
    function (...args) {
      console.log("onCancel", args);
    };

  const _onClearAll =
    args.onClearAll ??
    function (...args) {
      console.log("onClearAll", args);
      setSelectedItems({});
    };

  return (
    <Container
      {...args}
      selectedItems={selectedItems}
      uniqueId={1671377595106}
      onApply={_onApply}
      onCancel={_onCancel}
      onClearAll={_onClearAll}
    />
  );
};

export const Standard = Template.bind({});
Standard.args = {
  items: {
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      isPinned: true,
      isMultiSelect: true,
      options: [
        {
          label: "Chennai",
          value: "chennai",
        },
        {
          label: "Mumbai",
          value: "mumbai",
        },
        {
          label: "Bangalore",
          value: "bangalore",
        },
        {
          label: "Hyderabad",
          value: "hyderabad",
        },
        {
          label: "Pune",
          value: "pune",
        },
        {
          label: "Delhi",
          value: "delhi",
        },
        {
          label: "Kolkata",
          value: "kolkata",
        },
        {
          label: "Ahmedabad",
          value: "ahmedabad",
        },
      ],
    },
    2: {
      id: 2,
      label: "Department",
      type: TableFilterTypes.LIST,
      isPinned: false,
      isMultiSelect: true,
      options: [
        {
          label: "CSE",
          value: "cse",
        },
        {
          label: "ECE",
          value: "ece",
        },
        {
          label: "EEE",
          value: "eee",
        },
        {
          label: "MECH",
          value: "mech",
        },
        {
          label: "CIVIL",
          value: "civil",
        },
        {
          label: "IT",
          value: "it",
        },
        {
          label: "AERO",
          value: "aero",
        },
        {
          label: "CHEM",
          value: "chem",
        },
        {
          label: "MBA",
          value: "mba",
        },
      ],
    },
  },
};

export const DifferentTypeFilters = Template.bind({});
DifferentTypeFilters.args = {
  ...Standard.args,
  items: {
    ...Standard.args.items,
    3: {
      id: 3,
      isPinned: true,
      label: "Joining Date",
      type: TableFilterTypes.DATE,
      minDate: new Date("2022-12-01"),
      maxDate: new Date("2023-03-30"),
    },
    4: {
      id: 4,
      isPinned: true,
      label: "Salary",
      type: TableFilterTypes.NUMBER,
      min: 0,
      max: 100000,
    },
  },
};

export const WithPreSelectedItems = Template.bind({});
WithPreSelectedItems.args = {
  ...DifferentTypeFilters.args,
  selectedItems: {
    1: {
      chennai: true,
      mumbai: true,
    },
    3: [new Date("2022-12-01"), new Date("2023-04-01")],
    4: [5000, 10000],
  },
};

export const WithMorePinnedItems = Template.bind({});
WithMorePinnedItems.args = {
  ...Standard.args,
  items: {
    ...Standard.args.items,
    3: {
      id: 3,
      label: "Designation",
      type: TableFilterTypes.LIST,
      isPinned: true,
      isMultiSelect: true,
      options: [
        {
          label: "Manager",
          value: "manager",
        },
        {
          label: "Senior Manager",
          value: "seniormanager",
        },
        {
          label: "Team Lead",
          value: "teamlead",
        },
        {
          label: "Senior Team Lead",
          value: "seniorteamlead",
        },
        {
          label: "Associate",
          value: "associate",
        },
        {
          label: "Senior Associate",
          value: "seniorassociate",
        },
        {
          label: "Analyst",
          value: "analyst",
        },
        {
          label: "Senior Analyst",
          value: "senioranalyst",
        },
      ],
    },
  },
};

export const OnDemandListItems = Template.bind({});
OnDemandListItems.args = {
  ...Standard.args,
  items: {
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      subType: TableFilterListSubTypes.ON_DEMAND,
      isPinned: true,
      isMultiSelect: true,
      onOpen: async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              options: [
                {
                  label: "Chennai",
                  value: "chennai",
                },
                {
                  label: "Mumbai",
                  value: "mumbai",
                },
                {
                  label: "Bangalore",
                  value: "bangalore",
                },
                {
                  label: "Hyderabad",
                  value: "hyderabad",
                },
                {
                  label: "Pune",
                  value: "pune",
                },
                {
                  label: "Delhi",
                  value: "delhi",
                },
                {
                  label: "Kolkata",
                  value: "kolkata",
                },
                {
                  label: "Ahmedabad",
                  value: "ahmedabad",
                },
              ],
            });
          }, 5000);
        });
      },
      options: [],
    },
  },
};

let _tempPageIndex = 0;
export const PaginatedListItems = Template.bind({});
PaginatedListItems.args = {
  ...Standard.args,
  items: {
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      subType: TableFilterListSubTypes.PAGINATED,
      isPinned: true,
      isMultiSelect: true,
      options: [
        {
          label: "Chennai",
          value: "chennai",
        },
        {
          label: "Mumbai",
          value: "mumbai",
        },
        {
          label: "Ahemdabad",
          value: "ahemdabad",
        },
        {
          label: "Delhi",
          value: "delhi",
        },
        {
          label: "Kolkata",
          value: "kolkata",
        },
        {
          label: "Hyderabad",
          value: "hyderabad",
        },
        {
          label: "Pune",
          value: "pune",
        },
      ],
      onReachBottom: async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            if (_tempPageIndex === 0) {
              resolve({
                options: [
                  {
                    label: "Bangalore",
                    value: "bangalore",
                  },
                ],
                isEndOfList: false,
              });
            } else if (_tempPageIndex === 1) {
              resolve({
                options: [
                  {
                    label: "Vizag",
                    value: "vizag",
                  },
                ],
                isEndOfList: false,
              });
            } else if (_tempPageIndex === 2) {
              resolve({
                options: [
                  {
                    label: "Nagpur",
                    value: "nagpur",
                  },
                ],
                isEndOfList: true,
              });
            }
            _tempPageIndex++;
          }, 2000);
        });
      },
    },
  },
};

let filterOptions = [
  {
    label: "Chennai",
    value: "chennai",
  },
  {
    label: "Mumbai",
    value: "mumbai",
  },
  {
    label: "Mumbai-City",
    value: "mumbai-city",
  },
  {
    label: "Ahemdabad",
    value: "ahemdabad",
  },
  {
    label: "Delhi",
    value: "delhi",
  },
  {
    label: "Kolkata",
    value: "kolkata",
  },
  {
    label: "Hyderabad",
    value: "hyderabad",
  },
  {
    label: "Pune",
    value: "pune",
  },
  {
    label: "Bangalore",
    value: "bangalore",
  },
  {
    label: "Vizag",
    value: "vizag",
  },
  {
    label: "Nagpur",
    value: "nagpur",
  },
];
export const FullyCustomisableList = Template.bind({});
FullyCustomisableList.args = {
  ...Standard.args,
  isNonDiscreteApplyButton: true,
  items: {
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      subType: TableFilterListSubTypes.FULLY_CUSTOMISABLE,
      isPinned: true,
      isMultiSelect: true,
      onOpen: async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              options: [
                {
                  label: "New york",
                  value: "newyork",
                },
                {
                  label: "Sydney",
                  value: "sydney",
                },
                {
                  label: "Melbourne",
                  value: "melbourne",
                },
                {
                  label: "Lords",
                  value: "lords",
                },
                {
                  label: "Perth",
                  value: "perth",
                },
                {
                  label: "Cape Town",
                  value: "capetown",
                },
              ],
            });
          }, 2000);
        });
      },
      onReachBottom: async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            if (_tempPageIndex === 0) {
              resolve({
                options: [filterOptions[6]],
                isEndOfList: false,
              });
            } else if (_tempPageIndex === 1) {
              resolve({
                options: [filterOptions[7]],
                isEndOfList: false,
              });
            } else if (_tempPageIndex === 2) {
              resolve({
                options: [filterOptions[8]],
                isEndOfList: false,
              });
            } else if (_tempPageIndex === 3) {
              resolve({
                options: [filterOptions[9]],
                isEndOfList: true,
              });
            }
            _tempPageIndex++;
          }, 2000);
        });
      },
      onExternalSearch: async (searchText) => {
        return await new Promise((resolve) => {
          let filteredOptions = filterOptions.filter((option) => {
            return option.value
              .toLowerCase()
              .includes(searchText.toLowerCase());
          });
          resolve({
            options: filteredOptions,
          });
        });
      },
    },
  },
};

export const LimitedListSelection = Template.bind({});
LimitedListSelection.args = {
  ...Standard.args,
  items: {
    ...Standard.args.items,
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      isPinned: true,
      isMultiSelect: true,
      max: 2,
      options: [
        {
          label: "Chennai",
          value: "chennai",
        },
        {
          label: "Mumbai",
          value: "mumbai",
        },
        {
          label: "Bangalore",
          value: "bangalore",
        },
      ],
    },
  },
};

export const NonDiscreteApplyButton = Template.bind({});
NonDiscreteApplyButton.args = {
  ...Standard.args,
  isNonDiscreteApplyButton: true,
};

export const WithMandatoryItems = Template.bind({});
WithMandatoryItems.args = {
  ...Standard.args,
  items: {
    ...Standard.args.items,
    1: {
      ...Standard.args.items[1],
      isMandatory: true,
    },
    4: {
      id: 4,
      isPinned: true,
      isMandatory: true,
      label: "Salary",
      type: TableFilterTypes.NUMBER,
      min: 0,
      max: 100000,
    },
  },
  selectedItems: {
    1: {
      chennai: true,
      mumbai: true,
    },
  },
  isNonDiscreteApplyButton: true,
};
export const MinimumListSelection = Template.bind({});
MinimumListSelection.args = {
  ...Standard.args,
  items: {
    ...Standard.args.items,
    1: {
      ...Standard.args.items[1],
      min: 2,
    },
    gender: {
      id: "gender",
      type: TableFilterTypes.LIST,
      isPinned: true,
      isMultiSelect: false,
      label: "Gender",
      options: [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
      ],
    },
  },
  selectedItems: {
    1: {
      chennai: true,
      mumbai: true,
    },
  },
};
