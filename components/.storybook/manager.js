import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import packageJson from "../package.json";

const theme = create({
  base: 'light',
  brandTitle: `Disprz Component - '${packageJson.version}'`,
  brandUrl: `https://heuristix.visualstudio.com/Disprz/_artifacts/feed/DisprzWeb/Npm/@disprz%2Fcomponents/overview/${packageJson.version}`,
  colorPrimary: "#6A1CA6",
  colorSecondary: "#6A1CA6",
});

addons.setConfig({
  theme: theme,
  sidebar: {
    collapsedRoots: ["deprecated"],
  },
});