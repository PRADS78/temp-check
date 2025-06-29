import { toMatchImageSnapshot } from "jest-image-snapshot";
const puppeteer = require("puppeteer");
const path = require("path");
expect.extend({ toMatchImageSnapshot });

describe("Snackbar and its variants' appearance", () => {
  jest.setTimeout(10000);

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
      `#disprz-disprzsnackbar`
    );

    if (await page.$("button[title='Dismiss notification']")) {
      const storybookVersionButton = await page.waitForSelector(
        "button[title='Dismiss notification']"
      );
      await storybookVersionButton.click();
    }
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

    const toggleButton = await frame.waitForSelector(".showButton");
    await toggleButton.click();
    await page.waitForTimeout(1000); // wait for the dialog to open with animation

    const snackBar = await frame.waitForSelector(`div[class*="snackbar"]`);

    const snackBarScreenshot = await snackBar.screenshot();

    expect(snackBarScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  test("Basic", async () => {
    const explorerNodeId = "disprz-disprzsnackbar--basic";
    const fileName = "basic";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("Action", async () => {
    const explorerNodeId = "disprz-disprzsnackbar--action";
    const fileName = "action";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("ActionDismiss", async () => {
    const explorerNodeId = "disprz-disprzsnackbar--action-dismiss";
    const fileName = "action dismiss";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("MessageType", async () => {
    const explorerNodeId = "disprz-disprzsnackbar--message-type";
    const fileName = "message type";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
});
