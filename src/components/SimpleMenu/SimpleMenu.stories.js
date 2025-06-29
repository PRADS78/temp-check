import Menu from "./Menu";
import { useRef, useState } from "react";

export default {
  title: "Disprz/DisprzSimpleMenu",
};

const Template = (args) => {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={ref}
        style={{
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          height: "50px",
          width: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "5px",
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <span>Click Me</span>
      </div>
      <Menu
        {...args}
        uniqueId={1676614087026}
        referenceRef={ref.current}
        isVisible={isOpen}
        canUsePortal={false}
        onChangeVisibility={(value) => setIsOpen(value)}
        onItemClick={(item) => console.log(item)}
      />
    </div>
  );
};

export const Standard = Template.bind({});
Standard.args = {
  items: [
    {
      label: "Action 1",
      onClick: () => console.log("Action 1"),
      value: 1,
    },
    {
      label: "Action 2",
      onClick: () => console.log("Action 2"),
      value: 2,
    },
  ],
};

export const LongOption = Template.bind({});
LongOption.args = {
  items: [
    {
      label: "Action 1",
      onClick: () => console.log("Action 1"),
      value: 1,
    },
    {
      label: "Action 2",
      onClick: () => console.log("Action 2"),
      value: 2,
    },
    {
      label: "Very very long Option here",
      onClick: () => console.log("Long Option here"),
      value: 3,
    },
  ],
};
