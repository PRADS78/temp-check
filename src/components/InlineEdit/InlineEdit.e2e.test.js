import { toMatchImageSnapshot } from "jest-image-snapshot";
const puppeteer = require("puppeteer");
const path = require("path");
expect.extend({ toMatchImageSnapshot });

describe("InlineEdit and its variants' appearance", () => {
  jest.setTimeout(60000);

  let browser = null;
  let page = null;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzinlineedit`
    );

    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const hideAddonsButton = await page.waitForSelector(
      `[title="Hide addons [A]"]`
    );
    await hideAddonsButton.click();

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();

    const toggleButton = await frame.waitForSelector(`span[class*="label"]`);

    await toggleButton.click();

    const snackBar = await frame.waitForSelector(`div[class*="editContainer"]`);

    const snackBarScreenshot = await snackBar.screenshot();

    expect(snackBarScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzinlineedit--standard";
    const fileName = "standard";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
});
