const puppeteer = require("puppeteer");
const path = require("path");

describe("DatePicker and its variants' appearance", () => {
  jest.setTimeout(120000);
  let browser = null;
  let page = null;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });
    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });
    const hideAddonsButton = await page.waitForSelector(
      '[title="Hide addons [A]"]'
    );
    await hideAddonsButton.evaluate((b) => b.click());
    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzdatepicker`
    );
    await storyGroupButton.click();
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
    const containerSelector = '[data-testid="date-picker-container"]';
    const datePickerContainer = await frame.waitForSelector(containerSelector);

    if (open) {
      const component = await datePickerContainer.$(
        '[data-name="calendar-icon"]'
      );
      await component.click();
      await page.waitForTimeout(2000);
    }

    const datePickerScreenshot = await datePickerContainer.screenshot();

    expect(datePickerScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  describe("Standard", () => {
    const explorerNodeId = "disprz-disprzdatepicker--standard";
    test("[Closed] Standard", async () => {
      const fileName = "[Closed] Standard";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] Standard", async () => {
      const fileName = "[Open] Standard";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });

  describe("Range", () => {
    const explorerNodeId = "disprz-disprzdatepicker--range";
    test("[Closed] Range", async () => {
      const fileName = "[Closed] Range";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] Range", async () => {
      const fileName = "[Open] Range";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });

  describe("Multi Select", () => {
    const explorerNodeId = "disprz-disprzdatepicker--multi-select";
    test("[Closed] Multi Select", async () => {
      const fileName = "[Closed] Multi Select";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] Multi Select", async () => {
      const fileName = "[Open] Multi Select";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });

  describe("With Time", () => {
    const explorerNodeId = "disprz-disprzdatepicker--with-time";
    test("[Closed] With Time", async () => {
      const fileName = "[Closed] With Time";
      await runScreenshotTest({ explorerNodeId, fileName, open: false });
    });

    test("[Open] With Time", async () => {
      const fileName = "[Open] With Time";
      await runScreenshotTest({ explorerNodeId, fileName, open: true });
    });
  });
});
