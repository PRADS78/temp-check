const puppeteer = require("puppeteer");
const path = require("path");

describe("TimePicker and its variants' appearance", () => {
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
      `#disprz-disprztimepicker`
    );
    await storyGroupButton.click();

    const hideAddonsButton = await page.waitForSelector(
      '[title="Hide addons [A]"]'
    );
    return await hideAddonsButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  const runScreenshotTest = async ({ explorerNodeId, fileName, open }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const containerSelector = '[data-testid="time-picker-container"]';
    const timePickerContainer = await frame.waitForSelector(containerSelector);

    if (open) {
      const component = await timePickerContainer.$("input");
      await component.click();
      await page.waitForTimeout(2000);
    }

    const timePickerScreenshot = await timePickerContainer.screenshot();

    expect(timePickerScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  describe("Standard", () => {
    const explorerNodeId = "disprz-disprztimepicker--standard";
    test("[Closed] Standard", async () => {
      const fileName = "[Closed] Standard";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] Standard", async () => {
      const fileName = "[Open] Standard";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });

  // describe("Twenty Four", () => {
  //   const explorerNodeId = "refactored-timepicker--twenty-four";
  //   test("[Closed] Range", async () => {
  //     const fileName = "[Closed] Range";
  //     await runScreenshotTest({ explorerNodeId, fileName, open: false });
  //   });

  //   test("[Open] Range", async () => {
  //     const fileName = "[Open] Range";
  //     await runScreenshotTest({ explorerNodeId, fileName, open: true });
  //   });
  // });

  describe("Without Label", () => {
    const explorerNodeId = "disprz-disprztimepicker--without-label";
    test("[Closed] Without Label", async () => {
      const fileName = "[Closed] Without Label";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] Without Label", async () => {
      const fileName = "[Open] Without Label";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });
});
