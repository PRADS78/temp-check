module.exports = {
  "*.js": [
    "eslint --cache --fix --cache-location=./node_modules/.cache/eslint/.eslintcache",
    "jest --coverage=false --bail --findRelatedTests",
  ],
  "*.{scss,css}":
    "stylelint --cache --fix --cache-location=./node_modules/.cache/stylelint/.stylelintcache",
};
