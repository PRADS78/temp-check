import { setGlobalConfig } from "@storybook/testing-react";
import * as globalStorybookConfig from "./.storybook/preview";

import "@testing-library/jest-dom";

import { toMatchImageSnapshot } from "jest-image-snapshot";
expect.extend({ toMatchImageSnapshot });

setGlobalConfig(globalStorybookConfig);

// required by ReactSlick for testing
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

import fetch from "node-fetch";
window.fetch = fetch;

import { server } from "./__mocks__/nodeServer.js";
// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
