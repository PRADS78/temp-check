import { Tabs } from ".";

const storyConfig = {
  title: "Disprz/DisprzTabs",
  component: Tabs,
};

export default storyConfig;

const data = [
  {
    id: "functionalSkills",
    label: "Functional Skills",
    panel: () => (
      <div>
        Functional skills are competencies that are transferable to many
        different work settings.
      </div>
    ),
    ctrCls: "functional-class",
    initialBadge: 2,
  },
  {
    id: "leadershipSkills",
    label: "Leadership Skills",
    panel: (
      <div>
        Valuable leadership skills include the ability to delegate, inspire and
        communicate effectively.
      </div>
    ),
    initialBadge: 4,
  },
  {
    id: "digitalTools",
    label: "Digital Tools",
    panel: () => (
      <div>
        Digital learning tools include a wide variety of applications, websites,
        and learning platforms that facilitate learning.
      </div>
    ),
    initialBadge: 7,
  },
  {
    id: "metaSkills",
    label: "Meta Skills",
    panel: () => (
      <div>
        A meta-skill is a higher-order skill that boosts a person ability to
        learn and apply new knowledge quickly.
      </div>
    ),
    initialBadge: 3,
  },
];

function Template(args) {
  const containerStyle = {
    padding: "10px",
    width: "800px",
  };
  return (
    <div data-testid="tabs-container" style={containerStyle}>
      <Tabs {...args} uniqueId={1667213090808} />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  data: data,
  canShowShadow: true,
};

export const withBadge = Template.bind({});
withBadge.args = {
  data: data,
  canShowBadge: true,
};

const withScrollingData = [
  {
    label: "Albion Strawberry",
    panel: () => (
      <div>
        The first garden strawberry was grown in Brittany, France, during the
        late 18th century. Prior to this, wild strawberries and cultivated
        selections from wild strawberry species were the common source of the
        fruit. The strawberry fruit was mentioned in ancient Roman literature in
        reference to its medicinal use.
      </div>
    ),
  },
  {
    label: "Apple",
    panel: () => <div>Apple</div>,
  },
  {
    label: "Cheese",
    panel: () => <div>Cheese</div>,
  },
  {
    label: "Leadership Skills",
    panel: () => (
      <div>
        Valuable leadership skills include the ability to delegate, inspire and
        communicate effectively.
      </div>
    ),
  },
  {
    label: "Grape",
    panel: () => <div>Grape</div>,
  },
  {
    label: "Mamey",
    panel: () => <div>Mamey</div>,
  },
  {
    label: "Digital Tools",
    panel: () => (
      <div>
        Digital learning tools include a wide variety of applications, websites,
        and learning platforms that facilitate learning.
      </div>
    ),
  },
  {
    label: "Pistachio",
    panel: () => <div>Pistachio</div>,
  },
  {
    label: "Rocky Road",
    panel: () => <div>Rocky Road flavor</div>,
  },
  {
    label: "Meta Skills",
    panel: () => (
      <div>
        {" "}
        A meta-skill is a higher-order skill that boosts a person ability to
        learn and apply new knowledge quickly.
      </div>
    ),
  },
];

export const WithScrolling = Template.bind({});
WithScrolling.args = {
  data: withScrollingData,
  isDisabled: true,
};

export const DefaultTabId = Template.bind({});
DefaultTabId.args = {
  data: data,
  defaultTabId: "metaSkills",
};

export const DisabledTab = Template.bind({});
DisabledTab.args = {
  data: data.map((dataObject) => {
    return {
      ...dataObject,
      isDisabled: dataObject.id === "leadershipSkills",
    };
  }),
  defaultTabId: "leadershipSkills",
};

export const FullyDisabledTab = Template.bind({});
FullyDisabledTab.args = {
  ...Standard.args,
  isDisabled: true,
  defaultTabId: "leadershipSkills",
};

export const WithoutShadow = Template.bind({});
WithoutShadow.args = {
  ...Standard.args,
  canShowShadow: false,
};

const parameters = {
  jest: ["Tabs.test.js"],
};

Standard.parameters =
  DisabledTab.parameters =
  FullyDisabledTab.parameters =
  withBadge.parameters =
  WithScrolling.parameters =
  DefaultTabId.parameters =
  WithoutShadow.parameters =
    parameters;
