import { toMatchImageSnapshot } from "jest-image-snapshot";
const puppeteer = require("puppeteer");
const path = require("path");
expect.extend({ toMatchImageSnapshot });

describe("DropDown and its variants' appearance", () => {
  jest.setTimeout(120000);
  const constants = { OPEN: "open", CLOSED: "closed" };
  let browser = null;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });
  });

  afterAll(() => {
    browser.close();
  });

  const runScreenshotTest = async ({
    explorerNodeId,
    fileName,
    navigation,
  }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzdropdown`
    );
    await storyGroupButton.click();

    const hideAddonsButton = await page.waitForSelector(
      '[title="Hide addons [A]"]'
    );
    await hideAddonsButton.click();

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const containerSelector = '[data-testid="drop-down-container"]';
    const dropDownContainer = await frame.waitForSelector(containerSelector);
    const dropDown = await frame.waitForSelector(`${containerSelector} > div`);

    await navigation({ dropDown, page });

    const dropDownScreenshot = await dropDownContainer.screenshot();
    await page.close();
    expect(dropDownScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  const standardNavigator = (params) => {
    const {
      dropDownState,
      itemSelected,
      itemSelector,
      multiSelect,
      multiClick,
    } = params;
    return async ({ dropDown, page }) => {
      switch (dropDownState) {
        case constants.CLOSED:
          await dropDown.click();
          await page.waitForTimeout(400);
          if (multiClick) {
            let items = await dropDown.$$(itemSelector);
            for (const el of items) {
              await el.click();
            }
          } else {
            let listItem = await dropDown.$(itemSelector);
            await listItem.click();
          }
          if (multiSelect) {
            let arrowIcon = await dropDown.$('[class*="arrowIcon"]');
            await arrowIcon.click();
          }
          await page.waitForTimeout(400);
          break;
        case constants.OPEN:
          if (itemSelected) {
            await dropDown.click();
            await page.waitForTimeout(400);
            if (multiClick) {
              let items = await dropDown.$$(itemSelector);
              for (const el of items) {
                await el.click();
              }
            } else {
              let listItem = await dropDown.$(itemSelector);
              await listItem.click();
            }
            await page.waitForTimeout(400);
            await dropDown.click();
            await page.waitForTimeout(400);
          } else {
            await dropDown.click();
            await page.waitForTimeout(400);
          }
          break;
      }
    };
  };

  describe("Standard", () => {
    const explorerNodeId = "disprz-disprzdropdown--standard";
    const itemSelector = "li";
    test("[Closed] item-selected", async () => {
      const fileName = "[Standard] closed item-selected";
      const dropDownState = constants.CLOSED;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] item-selected", async () => {
      const fileName = "[Standard] open item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] no-item-selected", async () => {
      const fileName = "[Standard] open no-item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = false;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });
  });

  describe("grouped", () => {
    const explorerNodeId = "disprz-disprzdropdown--grouped";
    const itemSelector = '[class*="titledOptionsListItem"]';

    test("[Closed] item-selected", async () => {
      const fileName = "[Grouped] closed item-selected";
      const dropDownState = constants.CLOSED;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] item-selected", async () => {
      const fileName = "[Grouped] open item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] no-item-selected", async () => {
      const fileName = "[Grouped] open no-item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = false;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });
  });

  describe("grouped multi selection", () => {
    const explorerNodeId = "disprz-disprzdropdown--grouped-multi-selection";
    const itemSelector = '[class*="selectGroup"]';
    const multiSelect = true;

    test("[Closed] item-selected", async () => {
      const fileName = "[Grouped Multi Selection] closed item-selected";
      const dropDownState = constants.CLOSED;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] item-selected", async () => {
      const fileName = "[Grouped Multi Selection] open item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] no-item-selected", async () => {
      const fileName = "[Grouped Multi Selection] open no-item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = false;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });
  });

  describe("multiple with search", () => {
    const explorerNodeId = "disprz-disprzdropdown--multiple-with-search";
    const itemSelector = '[class*="optionItem"]';
    const multiSelect = true;
    const multiClick = true;

    test("[Closed] item-selected", async () => {
      const fileName = "[Multiple With Search] closed item-selected";
      const dropDownState = constants.CLOSED;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
        multiClick,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] item-selected", async () => {
      const fileName = "[Multiple With Search] open item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = true;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
        multiClick,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });

    test("[Open] no-item-selected", async () => {
      const fileName = "[Multi Select] open no-item-selected";
      const dropDownState = constants.OPEN;
      const itemSelected = false;
      const navigation = standardNavigator({
        dropDownState,
        itemSelected,
        itemSelector,
        multiSelect,
        multiClick,
      });
      await runScreenshotTest({ explorerNodeId, fileName, navigation });
    });
  });
});
