module.exports = (api) => {
  const isTest = api.env("test");
  if (isTest) {
    return {
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    };
  } else {
    return {
      presets: [
        ["@babel/preset-env"],
        ["@babel/preset-react", { runtime: "automatic" }],
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
    };
  }
};
