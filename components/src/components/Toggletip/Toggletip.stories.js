import { useRef, useState } from "react";
import ToggleTip from "./Toggletip";
import { Charts } from "../Charts";
import { PlainButton, PrimaryButton } from "../AppButton";
import { Info } from "@disprz/icons";
import styles from "./Toggletip.stories.module.scss";
import { faker } from "@faker-js/faker/locale/en";

export default {
  title: "Disprz/DisprzToggletip",
  component: ToggleTip,
};

const chartData = [
  {
    id: "php",
    label: "php",
    value: 78,
    color: "hsla(251, 74%, 57%, 1)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 16,
    color: "hsl(195, 70%, 50%)",
  },
  {
    id: "ruby",
    label: "ruby",
    value: 6,
    color: "hsl(89, 70%, 50%)",
  },
];

function Template(args) {
  const [childRef, setChildRef] = useState(null);
  const toggleTipRef = useRef(null);

  const _onReferenceClick =
    args.onReferenceClick ??
    function (e) {
      console.log("reference clicked", e);
    };

  return (
    <div
      data-testid="toggletip-container"
      style={{
        display: "flex",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
        width: "500px",
        paddingBottom: "50px",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {args.customTriggerButton &&
        args.customTriggerButton({
          show: () => {
            toggleTipRef.current?.show();
          },
        })}
      <Info
        className={styles.infoIcon}
        ref={setChildRef}
        onClick={() => {
          console.log("clicked");
        }}
        uniqueId={1674108764762}
        data-role="info-icon"
      />
      <ToggleTip
        ref={toggleTipRef}
        {...args}
        referenceRef={childRef}
        position="top"
        onReferenceClick={_onReferenceClick}
        uniqueId={1674136640084}
      >
        {args.children?.({
          hide: toggleTipRef.current?.hide,
          show: toggleTipRef.current?.show,
        })}
      </ToggleTip>
    </div>
  );
}

export const CustomContentOne = Template.bind({});
CustomContentOne.args = {
  children: () => {
    return (
      <div
        style={{
          height: "270px",
          width: "174px",
          fontFamily: "Custom-Regular",
          fontSize: "14px",
        }}
      >
        <span
          style={{
            color: "white",
          }}
        >
          User Activity
        </span>
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            marginTop: "8px",
            fontFamily: "Custom-Regular",
          }}
        >
          <Charts.Pie
            ctrCls={styles.pieChart}
            colors={[
              "hsla(251, 74%, 57%, 1)",
              "hsla(251, 45%, 74%, 1)",
              "hsla(221, 85%, 63%, 1)",
            ]}
            colorBy="index"
            isCanvas={false}
            data={chartData}
            uniqueId={1674051836569}
            innerRadius={0.45}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            enableArcLinkLabels={false}
            arcLabelsTextColor="#ffffff"
            legends={[
              {
                anchor: "bottom",
                direction: "column",
                justify: false,
                translateX: -30,
                translateY: 70,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 22,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const CustomContentTwo = Template.bind({});
CustomContentTwo.args = {
  children: ({ hide }) => {
    return (
      <div
        style={{
          minHeight: "110px",
          width: "292px",
          fontFamily: "Custom-Regular",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          {faker.lorem.lines(2)}
        </span>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "12px",
            justifyContent: "end",
          }}
        >
          <PlainButton label="Ignore" uniqueId={1674055913973} onClick={hide} />
          <PrimaryButton
            label="Manage"
            uniqueId={1674055961425}
            onClick={() => {
              console.log("clicked button");
            }}
          />
        </div>
      </div>
    );
  },
};

export const CustomContentWithExternalTrigger = Template.bind({});
CustomContentWithExternalTrigger.args = {
  customTriggerButton: ({ show }) => {
    return (
      <PrimaryButton
        label={"Custom trigger button"}
        uniqueId={1696855936762}
        onClick={() => {
          show();
        }}
      />
    );
  },
  children: () => {
    return (
      <div style={{ color: "white" }}>
        I&apos;m triggered externally by, another component using ref
      </div>
    );
  },
};
