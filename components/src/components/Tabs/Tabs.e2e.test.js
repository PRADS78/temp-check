import { toMatchImageSnapshot } from "jest-image-snapshot";
const puppeteer = require("puppeteer");
const path = require("path");
expect.extend({ toMatchImageSnapshot });

let browser = null;
let page = null;

const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
  const screenshotPath = path.join(__dirname, "snapshots");

  const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
  await explorerNode.click();
  await page.waitForTimeout(1500);

  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  const container = await frame.waitForSelector(
    `[data-testid="tabs-container"]`
  );

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Tabs and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprztabs`);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Expanded Labels", async () => {
    const explorerNodeId = "disprz-disprztabs--expanded-labels";
    const fileName = "expanded-labels";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprztabs--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Customized Label", async () => {
    const explorerNodeId = "disprz-disprztabs--with-customized-label";
    const fileName = "with-customized-label";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Scrolling", async () => {
    const explorerNodeId = "disprz-disprztabs--with-scrolling";
    const fileName = "with-scrolling";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled Tab", async () => {
    const explorerNodeId = "disprz-disprztabs--disabled-tab";
    const fileName = "disabled-tab";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled Tabs", async () => {
    const explorerNodeId = "disprz-disprztabs--fully-disabled-tab";
    const fileName = "disabled-tabs";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
