import { useState } from "react";
import UserSelectionWidget from "../UserSelectionWidget/UserSelectionWidget";
import { ReactComponent as AppIcon } from "./assets/AppIcons.svg";

export default {
  title: "Disprz/UserSelectionWidget",
  component: UserSelectionWidget,
  name: "UserSelectionWidget",
  decorators: [
    (story) => (
      <>
        <AppIcon />
        {story()}
      </>
    ),
  ],
};
const Template = (args) => <UserSelectionWidget {...args} />;

export const Basic = Template.bind({});
const additionalOptions = [
  {
    displayValue: "Trigger welcome email",
    onClick: (c) => {
      console.log(c);
    },
  },
  {
    displayValue: "Bulk Deactivate",
    onClick: (c) => {
      console.log(c);
    },
  },
];

Basic.args = {
  ctrCls: "",
  userFetchAPIUrl:
    "https://disprzpipeline.disprz.com/demoservice/api/service/searchusers",
  limitedUserDefinedFieldsSummaryFetchAPIUrl:
    "https://disprzpipeline.disprz.com/demoservice/api/service/getFilteredData",
  rowSelectable: true,
  showAdvancedSearch: true,
  showTotalCountAsHeading: true,
  additionalOptions: additionalOptions,
  user: {
    userName: "vasanth001",
    dbPointer: "dev",
  },
  extraQueryParams: {
    restrictToMyUsers: false,
  },
};
