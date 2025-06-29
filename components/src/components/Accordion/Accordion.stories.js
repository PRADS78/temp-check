import { Accordion } from ".";
import { useArgs } from "@storybook/client-api";
import { TextField } from "../TextField";
import AccordionContainer from "./AccordionContainer";
import { useState } from "react";
// import { useTranslation } from "react-i18next";

const storyConfig = {
  title: "Disprz/DisprzAccordion",
  component: Accordion,
};

export default storyConfig;

function Template(args) {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
  const containerStyle = {
    padding: "20px",
    width: "600px",
    height: "300px",
  };
  const onClick =
    args.onClick ??
    function () {
      setIsOpen(!isOpen);
    };
  return (
    <>
      <div data-testid="accordion-container" style={containerStyle}>
        <Accordion
          {...args}
          onClick={onClick}
          isOpen={isOpen}
          uniqueId={1669379163549}
        />
      </div>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
function TemplateGroup(args) {
  const [{ isOpen }, updateArgs] = useArgs();
  return (
    <>
      <AccordionContainer>
        <Accordion
          {...args}
          onClick={() => updateArgs({ isOpen: !isOpen })}
          title={{ label: "Item 1" }}
          key={101}
        />
        <Accordion
          {...args}
          onClick={() => updateArgs({ isOpen: !isOpen })}
          title={{ label: "Item 2" }}
          key={102}
        />
        <Accordion
          {...args}
          onClick={() => updateArgs({ isOpen: !isOpen })}
          title={{ label: "Item 3" }}
          key={103}
        />
        <Accordion
          {...args}
          onClick={() => updateArgs({ isOpen: !isOpen })}
          title={{ label: "Item 4" }}
          key={104}
        />
        <Accordion
          {...args}
          onClick={() => updateArgs({ isOpen: !isOpen })}
          title={{ label: "Item 5" }}
          key={105}
        />
      </AccordionContainer>
    </>
  );
}

const BodyComponent = () => {
  const profileContainer = {
    background: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.24)",
    borderRadius: "8px",
    padding: "11px 16px",
    marginTop: "16px",
    display: "flex",
    flexDirection: "row",
  };
  const avatar = {
    fontFamily: "Custom-SemiBold",
    fontSize: "12px",
    alignItems: "center",
    backgroundColor: "rgba(106, 28, 166, 0.06)",
    borderRadius: "50%",
    color: "rgb(106, 28, 166)",
    display: "flex",
    justifyContent: "center",
    flexShrink: "0",
    flexGrow: "0",
    aspectRatio: "1",
    overflow: "hidden",
    width: "36px",
    height: "36px",
  };
  const title = {
    paddingLeft: "12px",
    fontWeight: "600",
    fontSize: " 14px",
    color: "#000",
  };
  const subTitle = {
    fontWeight: "400",
    fontSize: " 12px",
    color: "rgba(0, 0, 0, 0.65)",
  };
  return (
    <>
      <div>
        Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, Body 2: Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam,
      </div>
      <div style={profileContainer}>
        <div style={avatar} height="36px">
          <img
            src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/436.jpg"
            height="36px"
            width="36px"
          />
        </div>
        <div style={title}>
          <div>Abhishekh</div>
          <div style={subTitle}>Associate Product Manager</div>
        </div>
      </div>
    </>
  );
};

const renderCustomComponent = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
      <TextField uniqueId={1669378927530} onChange={() => {}} />
    </div>
  );
};

export const Standard = Template.bind({});
Standard.args = {
  ctrCls: "",
  bodyCtrCls: "",
  title: {
    label: "Text Goes Here",
    // label: "",
  },
  children: <BodyComponent />,
  isOpen: false,
  canToggleAccordionOnTitleClick: true,
  canToggleAccordionOnHeaderClick: true,
  isHeaderTitleEditable: false,
  isDraggable: false,
};

export const WithActionButtons = Template.bind({});
WithActionButtons.args = {
  ...Standard.args,
  noOfActionsToRenderUpFront: 2,
  isHeaderTitleEditable: false,
  actions: [
    {
      label: "Save",
      value: 0,
      onClick: (e) => {
        e.stopPropagation();
      },
    },
    {
      label: "Cancel",
      value: 1,
      onClick: (e) => {
        e.stopPropagation();
      },
    },
    {
      label: "Option 1",
      value: 2,
      onClick: () => {},
    },
    {
      label: "Option 2",
      value: 3,
      onClick: () => {},
    },
  ],
};

export const WithCustomActions = Template.bind({});
WithCustomActions.args = {
  ...Standard.args,

  noOfActionsToRenderUpFront: 0,
  actions: [
    {
      label: "Option 1",
      value: 0,
      onClick: () => {},
    },
    {
      label: "Option 2",
      value: 0,
      onClick: () => {},
    },
  ],
  isCustomActions: true,
  customActions: renderCustomComponent(),
};
function InlineEditTemplate(args) {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? false);
  const [titleValue, setTitleValue] = useState("Text Goes Here");
  const containerStyle = {
    padding: "20px",
    width: "600px",
    height: "300px",
  };
  const onClick =
    args.onClick ??
    function () {
      setIsOpen(!isOpen);
    };
  return (
    <>
      <div data-testid="accordion-container" style={containerStyle}>
        <Accordion
          {...args}
          onClick={onClick}
          isOpen={isOpen}
          uniqueId={1669379163549}
          inlineEditProps={{
            value: titleValue,
            onSubmit: (e, textValue) => {
              setTitleValue(textValue);
              e.stopPropagation();
            },
            onCancel: (e) => {
              e.stopPropagation();
            },
            onChange: (e) => {
              e.stopPropagation();
            },
          }}
        />
      </div>
    </>
  );
}
export const withInlineEdit = InlineEditTemplate.bind({});
let titleValue = Standard.args.title.label;
console.log(titleValue);
withInlineEdit.args = {
  ...Standard.args,
  isHeaderTitleEditable: true,
  canToggleAccordionOnTitleClick: false,
};
// export const WithDrag = TemplateGroup.bind({});
// WithDrag.args = {
//   ...Standard.args,
// };
