import UdfSelector from "./UdfSelector";

const storyConfig = {
  title: "Disprz/DisprzUdfSelector",
  component: UdfSelector,
};

export default storyConfig;

const Template = (args) => {
  return (
    <div data-testid="udf-container" style={{ padding: "15px" }}>
      <UdfSelector
        onAdd={(items) => {
          console.log(items);
        }}
        onRemove={(items) => {
          console.log(items);
        }}
        {...args}
        leftDropDownCustomization={{
          ctrCls: "leftCtrCls",
          placeholder: "Select",
        }}
        rightDropDownCustomization={{
          ctrCls: "rightCtrCls",
          placeholder: "Select Values",
        }}
        uniqueId={1667217316494}
      />
    </div>
  );
};

export const Standard = Template.bind({});

export const DefaultSelected = Template.bind({});

export const WithEmptyUsersFilter = Template.bind({});

export const WithLimitedUdfToSelect = Template.bind({});

Standard.args = {
  ctrCls: "udfRowContainer",
  leftDropDownCustomization: {
    ctrCls: "leftCtrCls",
    placeholder: "Select",
  },
  rightDropDownCustomization: {
    ctrCls: "rightCtrCls",
    placeholder: "Select Values",
  },
  udfFetchAPiUrl: "https://storybookapi.disprz.com/udfs/",
  accessToken: "",
};

DefaultSelected.args = {
  ...Standard.args,
  defaultValues: [
    {
      udfFieldId: 1,
      udfFieldValues: [100],
    },
    {
      udfFieldId: 3,
      udfFieldValues: [300, 301],
    },
  ],
};

WithEmptyUsersFilter.args = {
  ...Standard.args,
  canHideUdfsWithZeroUsers: true,
};

WithLimitedUdfToSelect.args = {
  ...Standard.args,
  maxNoOfUdfToSelect: 2,
};

const parameters = {
  jest: ["UdfSelector.test.js"],
};

Standard.parameters =
  DefaultSelected.parameters =
  WithLimitedUdfToSelect.parameters =
    parameters;
