const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        transcludeMarkdown: true,
      },
    },
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-root-attribute/register",
    "@storybook/addon-jest",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push(
      {
        // match and process scss modules
        test: /\.module\.s[ca]ss$/,
        exclude: /(node_modules)/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName:
                  configType === "DEVELOPMENT"
                    ? "[local]__[hash:base64:5]"
                    : "[hash:base64:5]",
              },
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
      },
      {
        // match and process non-module scss files
        test: /(?<!\.module).s[ca]ss$/,
        exclude: /(node_modules)/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.svg/i,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
              exportType: "named",
            },
          },
        ],
      }
    );
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test.toString().includes("png")) {
        // Removing svg from the existing Storybook rule
        return {
          ...rule,
          test: /\.(ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
        };
      } else {
        return rule;
      }
    });

    config.plugins = [
      ...config.plugins,
      new CopyPlugin({
        patterns: [
          { from: "./mockServiceWorker.js", to: "./mockServiceWorker.js" },
        ],
      }),
    ];

    config.stats = {
      logging: config.stats.logging,
      loggingDebug: true // enable this to see sass-loader logs
        ? config.stats.loggingDebug
        : config.stats.loggingDebug.concat("sass-loader"),
    };

    // Return the altered config
    return config;
  },
};
