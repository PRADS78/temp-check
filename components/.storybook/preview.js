import { withRootAttribute } from "storybook-addon-root-attribute";
import { withTests } from "@storybook/addon-jest";
import results from "../.jest-test-results.json";
import { AutomationIdPrefixProvider } from "../src/AutomationIdPrefix";
import { PortalDomProvider } from "../src/components/PortalDomProvider";
import ThemeProvider from "../src/ThemeProvider/ThemeProvider";
import { DisprzLocalizer } from "../src/DisprzLocalizer";
import EN from "../src/strings/en.json";

if (typeof global.process === "undefined") {
  const { worker } = require("../__mocks__/browserServer");
  worker.start({
    serviceWorker: {
      url: "./mockServiceWorker.js",
    },
    findWorker: (scriptURL, _mockServiceWorkerUrl) =>
      scriptURL.includes("mockServiceWorker"),
  });
}

// export const globalTypes = {
//   locale: {
//     name: 'Locale',
//     description: 'Internationalization locale',
//     defaultValue: 'en',
//     toolbar: {
//       icon: 'globe',
//       items: [
//         { value: 'en', right: '🇺🇸', title: 'English' },
//         { value: 'fr', right: '🇫🇷', title: 'Français' },
//         { value: 'es', right: '🇪🇸', title: 'Español' },
//         { value: 'zh', right: '🇨🇳', title: '中文' },
//         { value: 'kr', right: '🇰🇷', title: '한국어' },
//       ],
//     },
//   },
// };

export const parameters = {
  rootAttribute: {
    root: "html",
    attribute: "dir",
    defaultState: {
      name: "Direction",
      value: "ltr",
    },
    states: [
      {
        name: "LTR",
        value: "ltr",
      },
      {
        name: "RTL",
        value: "rtl",
      },
    ],
  },
  // actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    sort: "requiredFirst",
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: [
        "Introduction",
        "Changelog",
        "Disprz",
        ["DisprzPortalDomProvider", "DisprzLocalizer", "*"],
      ],
    },
  },
};

export const decorators = [
  withRootAttribute(),
  withTests({
    results,
  }),
  (story,{globals}) => {
    return (
      <AutomationIdPrefixProvider value="stories">
        <ThemeProvider themeColor={"#6A1CA6"}>
          <DisprzLocalizer
            lang={"en"}
            defaultTranslation={EN}
            mfe={""}
            clientIdentifier=""
            terminologyInfoString={{
              en: [
                {
                  itemIdentifier: "term_skill_short",
                  itemName: "Skill",
                  singularForm: "Skill",
                  pluralForm: "Skills",
                  examples: ["Courses"],
                },
                {
                  itemIdentifier: "term_module",
                  itemName: "Module",
                  singularForm: "Module",
                  pluralForm: "Modules",
                  examples: ["Capsules"],
                },
                {
                  itemIdentifier: "term_learner",
                  itemName: "Learner",
                  singularForm: "Learner",
                  pluralForm: "Learners",
                  examples: ["Trainee"],
                }
              ],
            }}
          >
          <PortalDomProvider>{story()}</PortalDomProvider>
          </DisprzLocalizer>
        </ThemeProvider>
      </AutomationIdPrefixProvider>
    );
  },
];
