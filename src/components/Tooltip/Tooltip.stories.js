import { useRef, useState } from "react";
import { Tooltip } from ".";
import { ToolTipTypes } from "../../Enums";
import { DropDown } from "../DropDown";
import { PrimaryButton } from "../AppButton";

const storyConfig = {
  title: "Disprz/DisprzTooltip",
  component: Tooltip,
};

export default storyConfig;

function Template(args) {
  const [childRef, setChildRef] = useState(null);

  return (
    <div
      data-testid="tooltip-container"
      style={{
        display: "flex",
        position: "relative",
        paddingInline: "10rem",
        paddingBlock: "2rem",
      }}
    >
      <span
        data-testid="tooltip-reference"
        ref={setChildRef}
        style={{
          height: "100px",
          width: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "lightgrey",
          borderRadius: "8px",
          padding: "8px",
        }}
      >
        This is a container with a tooltip
      </span>
      <Tooltip {...args} referenceRef={childRef} uniqueId={1674024213235} />
    </div>
  );
}

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  message: "Tooltip",
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  ...WithoutTitle.args,
  message: "Sub text",
  title: "Title",
};

export const ProgressType = (args) => {
  const [childRef, setChildRef] = useState(null);
  return (
    <div
      data-testid="tooltip-container"
      style={{
        display: "flex",
        position: "relative",
        alignContent: "center",
        justifyContent: "center",
        gap: "100px",
        flexDirection: "column",
        paddingInline: "10rem",
        paddingBlock: "4rem",
      }}
    >
      <p data-testid="tooltip-reference" ref={setChildRef}>
        Some progress bar
      </p>
      <Tooltip {...args} referenceRef={childRef} uniqueId={1674024227200} />
    </div>
  );
};
ProgressType.args = {
  message: "100%",
  type: ToolTipTypes.PROGRESS,
  position: "top",
};

export const DifferentPositions = (args) => {
  const [childRef, setChildRef] = useState(null);
  const [position, setPosition] = useState("bottom");
  const items = useRef([
    {
      label: "Top",
      onClick: () => setPosition("top"),
      value: "top",
    },
    {
      label: "Top Start",
      onClick: () => setPosition("top-start"),
      value: "top-start",
    },
    {
      label: "Top End",
      onClick: () => setPosition("top-end"),
      value: "top-end",
    },
    {
      label: "Bottom",
      onClick: () => setPosition("bottom"),
      value: "bottom",
    },
    {
      label: "Bottom Left",
      onClick: () => setPosition("bottom-start"),
      value: "bottom-start",
    },
    {
      label: "Bottom Right",
      onClick: () => setPosition("bottom-end"),
      value: "bottom-end",
    },
    {
      label: "Left",
      onClick: () => setPosition("left"),
      value: "left",
    },
    {
      label: "Left Start",
      onClick: () => setPosition("left-start"),
      value: "left-start",
    },
    {
      label: "Left End",
      onClick: () => setPosition("left-end"),
      value: "left-end",
    },
    {
      label: "Right",
      onClick: () => setPosition("right"),
      value: "right",
    },
    {
      label: "Right Start",
      onClick: () => setPosition("right-start"),
      value: "right-start",
    },
    {
      label: "Right End",
      onClick: () => setPosition("right-end"),
      value: "right-end",
    },
  ]);
  return (
    <div
      data-testid="tooltip-container"
      style={{
        display: "flex",
        position: "relative",
        alignContent: "center",
        justifyContent: "center",
        gap: "100px",
        flexDirection: "column",
      }}
    >
      <span
        ref={setChildRef}
        style={{
          height: "200px",
          width: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "lightgrey",
          borderRadius: "8px",
          padding: "8px",
          left: 0,
        }}
      >
        Container
      </span>
      <DropDown
        items={items.current}
        onChange={(item) => {
          console.log(item);
          setPosition(item.value);
        }}
        uniqueId={1673691954363}
        value={position}
      />
      <Tooltip
        {...args}
        referenceRef={childRef}
        position={position}
        uniqueId={1674024246752}
      />
    </div>
  );
};
DifferentPositions.args = {
  ...WithTitle.args,
};

export const DynamicText = (args) => {
  const [childRef, setChildRef] = useState(null);
  const [tooltipMsg, setTooltipMsg] = useState("Copy link to clipboard!");
  const _onClick = () => {
    setTooltipMsg("Copied!");
  };
  return (
    <div>
      <PrimaryButton
        label="Click Here"
        uniqueId={1674024246753}
        ref={setChildRef}
        onClick={_onClick}
      />
      <Tooltip
        {...args}
        message={tooltipMsg}
        referenceRef={childRef}
        uniqueId={1674024246759}
        position={"bottom"}
      />
    </div>
  );
};
DynamicText.args = {
  ...WithoutTitle.args,
};
