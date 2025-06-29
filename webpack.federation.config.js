const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const reactVersion = "17.0.2";
const requiredVersion = `^17.0.0`;
const version = require("./package.json").version;

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = () => {
  return {
    mode: isDevelopment ? "development" : "production",
    devtool: isDevelopment ? "cheap-module-source-map" : "source-map",
    devServer: {
      port: 3002,
      client: {
        reconnect: 5,
        progress: true,
      },
      compress: true,
      host: "localhost.disprz.com",
      hot: true,
    },
    entry: {},
    output: {
      path: path.resolve(__dirname, `build-federation/${version}`),
      filename: "index.js",
      chunkFilename: "chunk.[name].[contenthash].js",
      clean: true,
      publicPath: "auto",
      library: {
        name: "disprzcomponents",
        type: "umd",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env"],
                [
                  "@babel/preset-react",
                  { runtime: "automatic", importSource: "react-library/react" },
                ],
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    corejs: 3,
                    version: "^7.21.0",
                  },
                ],
              ],
            },
          },
        },
        {
          // match and process scss modules
          test: /\.module\.s[ca]ss$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isDevelopment
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
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name][ext]",
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: "asset/inline",
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
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "index.css",
        chunkFilename: "index.css", // Intentionally the same as filename
      }),
      new ModuleFederationPlugin({
        name: "disprzComponents",
        filename: "remoteEntry.js",
        remotes: {
          "react-library": isDevelopment
            ? `reactLibrary@https://disprzmicrofrontend.disprz.com/react-library/${reactVersion}/development/remoteEntry.js`
            : `reactLibrary@https://disprzmicrofrontend.disprz.com/react-library/${reactVersion}/production/remoteEntry.js`,
        },
        exposes: {
          ".": "./src/remote.js",
        },
        shared: {
          // TODO: Currently duplicate react bundles are generated when using react-transition-group
          react: {
            // version: reactVersion, // Uncomment this if you want to use a specific version of react
            singleton: true,
            requiredVersion: requiredVersion,
            strictVersion: true,
          },
          "react-dom": {
            // version: reactVersion, // Uncomment this if you want to use a specific version of react-dom
            singleton: true,
            requiredVersion: requiredVersion,
            strictVersion: true,
          },
        },
      }),
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        chunks: "async",
        cacheGroups: {
          defaults: false,
          defaultVendors: false,
        },
      },
    },
  };
};
