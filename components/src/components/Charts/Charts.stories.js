import Bar from "./Bar";
import Line from "./Line";
import Pie from "./Pie";
import Funnel from "./Funnel";
import ScatterPlot from "./ScatterPlot";

const storyConfig = {
  title: "Disprz/DisprzCharts",
  parameters: {
    showToolbar: true,
    toolbar: {
      title: { hidden: true },
      zoom: { hidden: true },
      eject: { hidden: true },
      copy: { hidden: true },
      fullscreen: { hidden: true },
      enableShortcuts: { hidden: true },
    },
  },
};

export default storyConfig;

const Template = (args) => {
  let toRender = null;
  switch (args.type) {
    case "bar":
      toRender = <Bar {...args} uniqueId={1673505842979} />;
      break;
    case "line":
      toRender = <Line {...args} uniqueId={1673507645866} />;
      break;
    case "pie":
    case "doughnut":
      toRender = <Pie {...args} uniqueId={1673507662203} />;
      break;
    case "funnel":
      toRender = <Funnel {...args} uniqueId={1673506823249} />;
      break;
    case "scatterplot":
      toRender = <ScatterPlot {...args} uniqueId={1673507634718} />;
      break;
    default:
      toRender = <div>Not supported</div>;
      break;
  }

  return (
    <div
      data-testid="charts-container"
      style={{ height: "360px", width: "640px" }}
    >
      {toRender}
    </div>
  );
};

export const SvgBar = Template.bind({});
SvgBar.args = {
  type: "bar",
  data: [
    {
      country: "AD",
      "hot dog": 117,
      "hot dogColor": "hsl(90, 70%, 50%)",
      burger: 75,
      burgerColor: "hsl(50, 70%, 50%)",
      sandwich: 69,
      sandwichColor: "hsl(148, 70%, 50%)",
      kebab: 135,
      kebabColor: "hsl(273, 70%, 50%)",
      fries: 189,
      friesColor: "hsl(119, 70%, 50%)",
      donut: 27,
      donutColor: "hsl(247, 70%, 50%)",
    },
    {
      country: "AE",
      "hot dog": 138,
      "hot dogColor": "hsl(158, 70%, 50%)",
      burger: 144,
      burgerColor: "hsl(269, 70%, 50%)",
      sandwich: 66,
      sandwichColor: "hsl(111, 70%, 50%)",
      kebab: 33,
      kebabColor: "hsl(60, 70%, 50%)",
      fries: 196,
      friesColor: "hsl(49, 70%, 50%)",
      donut: 60,
      donutColor: "hsl(164, 70%, 50%)",
    },
    {
      country: "AF",
      "hot dog": 84,
      "hot dogColor": "hsl(70, 70%, 50%)",
      burger: 126,
      burgerColor: "hsl(194, 70%, 50%)",
      sandwich: 143,
      sandwichColor: "hsl(75, 70%, 50%)",
      kebab: 4,
      kebabColor: "hsl(245, 70%, 50%)",
      fries: 152,
      friesColor: "hsl(168, 70%, 50%)",
      donut: 108,
      donutColor: "hsl(157, 70%, 50%)",
    },
    {
      country: "AG",
      "hot dog": 29,
      "hot dogColor": "hsl(52, 70%, 50%)",
      burger: 149,
      burgerColor: "hsl(46, 70%, 50%)",
      sandwich: 178,
      sandwichColor: "hsl(154, 70%, 50%)",
      kebab: 19,
      kebabColor: "hsl(158, 70%, 50%)",
      fries: 9,
      friesColor: "hsl(64, 70%, 50%)",
      donut: 86,
      donutColor: "hsl(68, 70%, 50%)",
    },
    {
      country: "AI",
      "hot dog": 54,
      "hot dogColor": "hsl(277, 70%, 50%)",
      burger: 6,
      burgerColor: "hsl(118, 70%, 50%)",
      sandwich: 64,
      sandwichColor: "hsl(56, 70%, 50%)",
      kebab: 67,
      kebabColor: "hsl(56, 70%, 50%)",
      fries: 81,
      friesColor: "hsl(233, 70%, 50%)",
      donut: 47,
      donutColor: "hsl(154, 70%, 50%)",
    },
    {
      country: "AL",
      "hot dog": 29,
      "hot dogColor": "hsl(10, 70%, 50%)",
      burger: 180,
      burgerColor: "hsl(339, 70%, 50%)",
      sandwich: 195,
      sandwichColor: "hsl(319, 70%, 50%)",
      kebab: 13,
      kebabColor: "hsl(28, 70%, 50%)",
      fries: 106,
      friesColor: "hsl(137, 70%, 50%)",
      donut: 46,
      donutColor: "hsl(251, 70%, 50%)",
    },
    {
      country: "AM",
      "hot dog": 130,
      "hot dogColor": "hsl(137, 70%, 50%)",
      burger: 126,
      burgerColor: "hsl(288, 70%, 50%)",
      sandwich: 82,
      sandwichColor: "hsl(260, 70%, 50%)",
      kebab: 132,
      kebabColor: "hsl(347, 70%, 50%)",
      fries: 28,
      friesColor: "hsl(187, 70%, 50%)",
      donut: 159,
      donutColor: "hsl(35, 70%, 50%)",
    },
  ],
  keys: ["hot dog", "burger", "sandwich", "kebab", "fries", "donut"],
  indexBy: "country",
  margin: { top: 50, right: 130, bottom: 50, left: 60 },
  padding: 0.3,
  valueScale: { type: "linear" },
  indexScale: { type: "band", round: true },
  colors: { scheme: "nivo" },
  defs: [
    {
      id: "dots",
      type: "patternDots",
      background: "inherit",
      color: "#38bcb2",
      size: 4,
      padding: 1,
      stagger: true,
    },
    {
      id: "lines",
      type: "patternLines",
      background: "inherit",
      color: "#eed312",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
  ],
  fill: [
    {
      match: {
        id: "fries",
      },
      id: "dots",
    },
    {
      match: {
        id: "sandwich",
      },
      id: "lines",
    },
  ],
  borderColor: {
    from: "color",
    modifiers: [["darker", 1.6]],
  },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "country",
    legendPosition: "middle",
    legendOffset: 32,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "food",
    legendPosition: "middle",
    legendOffset: -40,
  },
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: {
    from: "color",
    modifiers: [["darker", 1.6]],
  },
  legends: [
    {
      dataFrom: "keys",
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 120,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
  role: "application",
  ariaLabel: "Nivo bar chart demo",
  barAriaLabel: function (e) {
    return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
  },
};

export const CanvasBar = Template.bind({});
CanvasBar.args = {
  isCanvas: true,
  ...SvgBar.args,
};

export const SvgLine = Template.bind({});
SvgLine.args = {
  type: "line",
  data: [
    {
      id: "japan",
      color: "hsl(327, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 96,
        },
        {
          x: "helicopter",
          y: 82,
        },
        {
          x: "boat",
          y: 237,
        },
        {
          x: "train",
          y: 252,
        },
        {
          x: "subway",
          y: 39,
        },
        {
          x: "bus",
          y: 147,
        },
        {
          x: "car",
          y: 249,
        },
        {
          x: "moto",
          y: 212,
        },
        {
          x: "bicycle",
          y: 291,
        },
        {
          x: "horse",
          y: 173,
        },
        {
          x: "skateboard",
          y: 212,
        },
        {
          x: "others",
          y: 108,
        },
      ],
    },
    {
      id: "france",
      color: "hsl(151, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 40,
        },
        {
          x: "helicopter",
          y: 54,
        },
        {
          x: "boat",
          y: 277,
        },
        {
          x: "train",
          y: 183,
        },
        {
          x: "subway",
          y: 181,
        },
        {
          x: "bus",
          y: 118,
        },
        {
          x: "car",
          y: 199,
        },
        {
          x: "moto",
          y: 252,
        },
        {
          x: "bicycle",
          y: 117,
        },
        {
          x: "horse",
          y: 182,
        },
        {
          x: "skateboard",
          y: 244,
        },
        {
          x: "others",
          y: 45,
        },
      ],
    },
    {
      id: "us",
      color: "hsl(105, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 66,
        },
        {
          x: "helicopter",
          y: 7,
        },
        {
          x: "boat",
          y: 214,
        },
        {
          x: "train",
          y: 41,
        },
        {
          x: "subway",
          y: 259,
        },
        {
          x: "bus",
          y: 226,
        },
        {
          x: "car",
          y: 45,
        },
        {
          x: "moto",
          y: 156,
        },
        {
          x: "bicycle",
          y: 157,
        },
        {
          x: "horse",
          y: 103,
        },
        {
          x: "skateboard",
          y: 277,
        },
        {
          x: "others",
          y: 80,
        },
      ],
    },
    {
      id: "germany",
      color: "hsl(258, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 207,
        },
        {
          x: "helicopter",
          y: 40,
        },
        {
          x: "boat",
          y: 84,
        },
        {
          x: "train",
          y: 189,
        },
        {
          x: "subway",
          y: 149,
        },
        {
          x: "bus",
          y: 223,
        },
        {
          x: "car",
          y: 209,
        },
        {
          x: "moto",
          y: 17,
        },
        {
          x: "bicycle",
          y: 33,
        },
        {
          x: "horse",
          y: 221,
        },
        {
          x: "skateboard",
          y: 110,
        },
        {
          x: "others",
          y: 208,
        },
      ],
    },
    {
      id: "norway",
      color: "hsl(89, 70%, 50%)",
      data: [
        {
          x: "plane",
          y: 22,
        },
        {
          x: "helicopter",
          y: 266,
        },
        {
          x: "boat",
          y: 299,
        },
        {
          x: "train",
          y: 134,
        },
        {
          x: "subway",
          y: 220,
        },
        {
          x: "bus",
          y: 128,
        },
        {
          x: "car",
          y: 84,
        },
        {
          x: "moto",
          y: 229,
        },
        {
          x: "bicycle",
          y: 242,
        },
        {
          x: "horse",
          y: 184,
        },
        {
          x: "skateboard",
          y: 102,
        },
        {
          x: "others",
          y: 84,
        },
      ],
    },
  ],
  margin: { top: 50, right: 110, bottom: 50, left: 60 },
  xScale: { type: "point" },
  yScale: {
    type: "linear",
    min: "auto",
    max: "auto",
    stacked: true,
    reverse: false,
  },
  yFormat: " >-.2f",
  axisTop: null,
  axisRight: null,
  axisBottom: {
    orient: "bottom",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "transportation",
    legendOffset: 36,
    legendPosition: "middle",
  },
  axisLeft: {
    orient: "left",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "count",
    legendOffset: -40,
    legendPosition: "middle",
  },
  pointSize: 10,
  pointColor: { theme: "background" },
  pointBorderWidth: 2,
  pointBorderColor: { from: "serieColor" },
  pointLabelYOffset: -12,
  useMesh: true,
  legends: [
    {
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: "left-to-right",
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: "circle",
      symbolBorderColor: "rgba(0, 0, 0, .5)",
      effects: [
        {
          on: "hover",
          style: {
            itemBackground: "rgba(0, 0, 0, .03)",
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
};

export const CanvasLine = Template.bind({});
CanvasLine.args = {
  isCanvas: true,
  ...SvgLine.args,
};

export const SvgPie = Template.bind({});
SvgPie.args = {
  type: "pie",
  data: [
    {
      id: "hack",
      label: "hack",
      value: 562,
      color: "hsl(312, 70%, 50%)",
    },
    {
      id: "lisp",
      label: "lisp",
      value: 370,
      color: "hsl(349, 70%, 50%)",
    },
    {
      id: "haskell",
      label: "haskell",
      value: 9,
      color: "hsl(50, 70%, 50%)",
    },
    {
      id: "c",
      label: "c",
      value: 245,
      color: "hsl(256, 70%, 50%)",
    },
    {
      id: "python",
      label: "python",
      value: 91,
      color: "hsl(85, 70%, 50%)",
    },
  ],
  margin: { top: 40, right: 80, bottom: 80, left: 80 },
  innerRadius: 0,
  padAngle: 0.7,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  borderWidth: 1,
  borderColor: {
    from: "color",
    modifiers: [["darker", 0.2]],
  },
  arcLinkLabelsSkipAngle: 10,
  arcLinkLabelsTextColor: "#333333",
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: "color" },
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: {
    from: "color",
    modifiers: [["darker", 2]],
  },
  defs: [
    {
      id: "dots",
      type: "patternDots",
      background: "inherit",
      color: "rgba(255, 255, 255, 0.3)",
      size: 4,
      padding: 1,
      stagger: true,
    },
    {
      id: "lines",
      type: "patternLines",
      background: "inherit",
      color: "rgba(255, 255, 255, 0.3)",
      rotation: -45,
      lineWidth: 6,
      spacing: 10,
    },
  ],
  fill: [
    {
      match: {
        id: "ruby",
      },
      id: "dots",
    },
    {
      match: {
        id: "c",
      },
      id: "dots",
    },
    {
      match: {
        id: "go",
      },
      id: "dots",
    },
    {
      match: {
        id: "python",
      },
      id: "dots",
    },
    {
      match: {
        id: "scala",
      },
      id: "lines",
    },
    {
      match: {
        id: "lisp",
      },
      id: "lines",
    },
    {
      match: {
        id: "elixir",
      },
      id: "lines",
    },
    {
      match: {
        id: "javascript",
      },
      id: "lines",
    },
  ],
  legends: [
    {
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 56,
      itemsSpacing: 0,
      itemWidth: 100,
      itemHeight: 18,
      itemTextColor: "#999",
      itemDirection: "left-to-right",
      itemOpacity: 1,
      symbolSize: 18,
      symbolShape: "circle",
      effects: [
        {
          on: "hover",
          style: {
            itemTextColor: "#000",
          },
        },
      ],
    },
  ],
};

export const CanvasPie = Template.bind({});
CanvasPie.args = {
  isCanvas: true,
  ...SvgPie.args,
};

export const SvgDoughnut = Template.bind({});
SvgDoughnut.args = {
  ...SvgPie.args,
  type: "doughnut",
  innerRadius: 0.7,
};

export const SvgFunnel = Template.bind({});
SvgFunnel.args = {
  type: "funnel",
  data: [
    {
      id: "step_sent",
      value: 77480,
      label: "Sent",
    },
    {
      id: "step_viewed",
      value: 68875,
      label: "Viewed",
    },
    {
      id: "step_clicked",
      value: 41488,
      label: "Clicked",
    },
    {
      id: "step_add_to_card",
      value: 37117,
      label: "Add To Card",
    },
    {
      id: "step_purchased",
      value: 22939,
      label: "Purchased",
    },
  ],
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  valueFormat: ">-.4s",
  colors: { scheme: "spectral" },
  borderWidth: 20,
  labelColor: {
    from: "color",
    modifiers: [["darker", 3]],
  },
  beforeSeparatorLength: 100,
  beforeSeparatorOffset: 20,
  afterSeparatorLength: 100,
  afterSeparatorOffset: 20,
  currentPartSizeExtension: 10,
  currentBorderWidth: 40,
  motionConfig: "wobbly",
};

export const SvgScatterPlot = Template.bind({});
SvgScatterPlot.args = {
  type: "scatterplot",
  data: [
    {
      id: "group A",
      data: [
        {
          x: 22,
          y: 1,
        },
        {
          x: 6,
          y: 40,
        },
        {
          x: 46,
          y: 21,
        },
        {
          x: 34,
          y: 17,
        },
        {
          x: 16,
          y: 59,
        },
        {
          x: 37,
          y: 13,
        },
        {
          x: 41,
          y: 64,
        },
        {
          x: 98,
          y: 68,
        },
        {
          x: 89,
          y: 120,
        },
        {
          x: 8,
          y: 79,
        },
        {
          x: 0,
          y: 0,
        },
        {
          x: 71,
          y: 104,
        },
        {
          x: 35,
          y: 45,
        },
        {
          x: 93,
          y: 79,
        },
        {
          x: 28,
          y: 33,
        },
        {
          x: 23,
          y: 30,
        },
        {
          x: 48,
          y: 7,
        },
        {
          x: 35,
          y: 100,
        },
        {
          x: 35,
          y: 50,
        },
        {
          x: 90,
          y: 71,
        },
        {
          x: 60,
          y: 30,
        },
        {
          x: 29,
          y: 13,
        },
        {
          x: 4,
          y: 111,
        },
        {
          x: 75,
          y: 117,
        },
        {
          x: 94,
          y: 54,
        },
        {
          x: 67,
          y: 75,
        },
        {
          x: 25,
          y: 11,
        },
        {
          x: 55,
          y: 45,
        },
        {
          x: 99,
          y: 94,
        },
        {
          x: 39,
          y: 35,
        },
        {
          x: 73,
          y: 8,
        },
        {
          x: 2,
          y: 110,
        },
        {
          x: 2,
          y: 4,
        },
        {
          x: 95,
          y: 93,
        },
        {
          x: 64,
          y: 55,
        },
        {
          x: 43,
          y: 20,
        },
        {
          x: 39,
          y: 18,
        },
        {
          x: 58,
          y: 2,
        },
        {
          x: 72,
          y: 12,
        },
        {
          x: 76,
          y: 82,
        },
        {
          x: 1,
          y: 101,
        },
        {
          x: 93,
          y: 13,
        },
        {
          x: 20,
          y: 50,
        },
        {
          x: 24,
          y: 4,
        },
        {
          x: 32,
          y: 62,
        },
        {
          x: 55,
          y: 92,
        },
        {
          x: 56,
          y: 30,
        },
        {
          x: 12,
          y: 52,
        },
        {
          x: 2,
          y: 116,
        },
        {
          x: 89,
          y: 29,
        },
      ],
    },
    {
      id: "group B",
      data: [
        {
          x: 87,
          y: 11,
        },
        {
          x: 3,
          y: 32,
        },
        {
          x: 70,
          y: 13,
        },
        {
          x: 26,
          y: 15,
        },
        {
          x: 66,
          y: 23,
        },
        {
          x: 17,
          y: 101,
        },
        {
          x: 39,
          y: 90,
        },
        {
          x: 33,
          y: 104,
        },
        {
          x: 53,
          y: 118,
        },
        {
          x: 72,
          y: 31,
        },
        {
          x: 87,
          y: 28,
        },
        {
          x: 65,
          y: 90,
        },
        {
          x: 52,
          y: 17,
        },
        {
          x: 20,
          y: 62,
        },
        {
          x: 16,
          y: 13,
        },
        {
          x: 24,
          y: 5,
        },
        {
          x: 65,
          y: 64,
        },
        {
          x: 87,
          y: 12,
        },
        {
          x: 94,
          y: 70,
        },
        {
          x: 18,
          y: 76,
        },
        {
          x: 36,
          y: 107,
        },
        {
          x: 43,
          y: 119,
        },
        {
          x: 78,
          y: 75,
        },
        {
          x: 25,
          y: 8,
        },
        {
          x: 30,
          y: 51,
        },
        {
          x: 57,
          y: 2,
        },
        {
          x: 95,
          y: 51,
        },
        {
          x: 53,
          y: 98,
        },
        {
          x: 65,
          y: 53,
        },
        {
          x: 71,
          y: 55,
        },
        {
          x: 35,
          y: 50,
        },
        {
          x: 45,
          y: 106,
        },
        {
          x: 90,
          y: 118,
        },
        {
          x: 78,
          y: 59,
        },
        {
          x: 41,
          y: 82,
        },
        {
          x: 57,
          y: 32,
        },
        {
          x: 4,
          y: 115,
        },
        {
          x: 11,
          y: 104,
        },
        {
          x: 8,
          y: 14,
        },
        {
          x: 44,
          y: 11,
        },
        {
          x: 97,
          y: 65,
        },
        {
          x: 74,
          y: 53,
        },
        {
          x: 71,
          y: 12,
        },
        {
          x: 52,
          y: 57,
        },
        {
          x: 63,
          y: 55,
        },
        {
          x: 49,
          y: 10,
        },
        {
          x: 40,
          y: 16,
        },
        {
          x: 63,
          y: 13,
        },
        {
          x: 80,
          y: 54,
        },
        {
          x: 70,
          y: 89,
        },
      ],
    },
    {
      id: "group C",
      data: [
        {
          x: 98,
          y: 100,
        },
        {
          x: 62,
          y: 20,
        },
        {
          x: 35,
          y: 71,
        },
        {
          x: 100,
          y: 47,
        },
        {
          x: 2,
          y: 12,
        },
        {
          x: 20,
          y: 12,
        },
        {
          x: 93,
          y: 98,
        },
        {
          x: 50,
          y: 98,
        },
        {
          x: 9,
          y: 101,
        },
        {
          x: 52,
          y: 104,
        },
        {
          x: 61,
          y: 41,
        },
        {
          x: 97,
          y: 116,
        },
        {
          x: 73,
          y: 117,
        },
        {
          x: 57,
          y: 11,
        },
        {
          x: 39,
          y: 30,
        },
        {
          x: 28,
          y: 93,
        },
        {
          x: 58,
          y: 114,
        },
        {
          x: 35,
          y: 47,
        },
        {
          x: 79,
          y: 91,
        },
        {
          x: 50,
          y: 94,
        },
        {
          x: 70,
          y: 119,
        },
        {
          x: 25,
          y: 3,
        },
        {
          x: 17,
          y: 28,
        },
        {
          x: 62,
          y: 71,
        },
        {
          x: 52,
          y: 49,
        },
        {
          x: 87,
          y: 61,
        },
        {
          x: 33,
          y: 0,
        },
        {
          x: 100,
          y: 31,
        },
        {
          x: 98,
          y: 64,
        },
        {
          x: 72,
          y: 43,
        },
        {
          x: 82,
          y: 10,
        },
        {
          x: 15,
          y: 25,
        },
        {
          x: 81,
          y: 96,
        },
        {
          x: 18,
          y: 70,
        },
        {
          x: 53,
          y: 2,
        },
        {
          x: 77,
          y: 116,
        },
        {
          x: 59,
          y: 82,
        },
        {
          x: 59,
          y: 119,
        },
        {
          x: 100,
          y: 0,
        },
        {
          x: 2,
          y: 78,
        },
        {
          x: 73,
          y: 70,
        },
        {
          x: 51,
          y: 66,
        },
        {
          x: 29,
          y: 41,
        },
        {
          x: 29,
          y: 41,
        },
        {
          x: 68,
          y: 35,
        },
        {
          x: 83,
          y: 71,
        },
        {
          x: 0,
          y: 83,
        },
        {
          x: 96,
          y: 97,
        },
        {
          x: 30,
          y: 23,
        },
        {
          x: 56,
          y: 103,
        },
      ],
    },
    {
      id: "group D",
      data: [
        {
          x: 6,
          y: 81,
        },
        {
          x: 61,
          y: 27,
        },
        {
          x: 5,
          y: 66,
        },
        {
          x: 100,
          y: 82,
        },
        {
          x: 95,
          y: 0,
        },
        {
          x: 50,
          y: 72,
        },
        {
          x: 37,
          y: 36,
        },
        {
          x: 13,
          y: 20,
        },
        {
          x: 26,
          y: 93,
        },
        {
          x: 95,
          y: 39,
        },
        {
          x: 0,
          y: 105,
        },
        {
          x: 69,
          y: 109,
        },
        {
          x: 43,
          y: 103,
        },
        {
          x: 75,
          y: 7,
        },
        {
          x: 84,
          y: 49,
        },
        {
          x: 78,
          y: 73,
        },
        {
          x: 46,
          y: 111,
        },
        {
          x: 92,
          y: 38,
        },
        {
          x: 46,
          y: 54,
        },
        {
          x: 22,
          y: 116,
        },
        {
          x: 51,
          y: 88,
        },
        {
          x: 64,
          y: 17,
        },
        {
          x: 52,
          y: 116,
        },
        {
          x: 90,
          y: 105,
        },
        {
          x: 4,
          y: 108,
        },
        {
          x: 19,
          y: 93,
        },
        {
          x: 30,
          y: 86,
        },
        {
          x: 79,
          y: 72,
        },
        {
          x: 92,
          y: 57,
        },
        {
          x: 68,
          y: 102,
        },
        {
          x: 12,
          y: 117,
        },
        {
          x: 20,
          y: 47,
        },
        {
          x: 62,
          y: 14,
        },
        {
          x: 49,
          y: 24,
        },
        {
          x: 79,
          y: 117,
        },
        {
          x: 18,
          y: 47,
        },
        {
          x: 51,
          y: 77,
        },
        {
          x: 30,
          y: 54,
        },
        {
          x: 0,
          y: 37,
        },
        {
          x: 13,
          y: 111,
        },
        {
          x: 96,
          y: 117,
        },
        {
          x: 97,
          y: 105,
        },
        {
          x: 36,
          y: 8,
        },
        {
          x: 58,
          y: 40,
        },
        {
          x: 18,
          y: 108,
        },
        {
          x: 17,
          y: 111,
        },
        {
          x: 5,
          y: 0,
        },
        {
          x: 67,
          y: 113,
        },
        {
          x: 60,
          y: 1,
        },
        {
          x: 10,
          y: 76,
        },
      ],
    },
    {
      id: "group E",
      data: [
        {
          x: 26,
          y: 58,
        },
        {
          x: 93,
          y: 26,
        },
        {
          x: 63,
          y: 107,
        },
        {
          x: 99,
          y: 1,
        },
        {
          x: 87,
          y: 118,
        },
        {
          x: 36,
          y: 63,
        },
        {
          x: 11,
          y: 98,
        },
        {
          x: 35,
          y: 1,
        },
        {
          x: 87,
          y: 64,
        },
        {
          x: 57,
          y: 35,
        },
        {
          x: 30,
          y: 59,
        },
        {
          x: 32,
          y: 20,
        },
        {
          x: 11,
          y: 64,
        },
        {
          x: 16,
          y: 94,
        },
        {
          x: 25,
          y: 87,
        },
        {
          x: 74,
          y: 105,
        },
        {
          x: 9,
          y: 101,
        },
        {
          x: 43,
          y: 93,
        },
        {
          x: 34,
          y: 3,
        },
        {
          x: 7,
          y: 115,
        },
        {
          x: 78,
          y: 86,
        },
        {
          x: 21,
          y: 1,
        },
        {
          x: 55,
          y: 36,
        },
        {
          x: 72,
          y: 0,
        },
        {
          x: 23,
          y: 25,
        },
        {
          x: 3,
          y: 90,
        },
        {
          x: 18,
          y: 78,
        },
        {
          x: 37,
          y: 8,
        },
        {
          x: 12,
          y: 8,
        },
        {
          x: 12,
          y: 11,
        },
        {
          x: 23,
          y: 41,
        },
        {
          x: 67,
          y: 107,
        },
        {
          x: 9,
          y: 77,
        },
        {
          x: 20,
          y: 85,
        },
        {
          x: 33,
          y: 51,
        },
        {
          x: 96,
          y: 32,
        },
        {
          x: 92,
          y: 45,
        },
        {
          x: 6,
          y: 104,
        },
        {
          x: 86,
          y: 113,
        },
        {
          x: 50,
          y: 65,
        },
        {
          x: 69,
          y: 45,
        },
        {
          x: 58,
          y: 60,
        },
        {
          x: 22,
          y: 50,
        },
        {
          x: 89,
          y: 85,
        },
        {
          x: 31,
          y: 35,
        },
        {
          x: 84,
          y: 104,
        },
        {
          x: 81,
          y: 96,
        },
        {
          x: 26,
          y: 76,
        },
        {
          x: 28,
          y: 100,
        },
        {
          x: 83,
          y: 117,
        },
      ],
    },
  ],
  margin: { top: 60, right: 140, bottom: 70, left: 90 },
  xScale: { type: "linear", min: 0, max: "auto" },
  xFormat: ">-.2f",
  yScale: { type: "linear", min: 0, max: "auto" },
  yFormat: ">-.2f",
  blendMode: "multiply",
  axisTop: null,
  axisRight: null,
  axisBottom: {
    orient: "bottom",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "weight",
    legendPosition: "middle",
    legendOffset: 46,
  },
  axisLeft: {
    orient: "left",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "size",
    legendPosition: "middle",
    legendOffset: -60,
  },
  legends: [
    {
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 130,
      translateY: 0,
      itemWidth: 100,
      itemHeight: 12,
      itemsSpacing: 5,
      itemDirection: "left-to-right",
      symbolSize: 12,
      symbolShape: "circle",
      effects: [
        {
          on: "hover",
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
};

export const CanvasScatterPlot = Template.bind({});
CanvasScatterPlot.args = {
  isCanvas: true,
  ...SvgScatterPlot.args,
};
