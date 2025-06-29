const puppeteer = require("puppeteer");
const path = require("path");

describe("Tooltip and its variants' appearance", () => {
  let browser = null;
  let page = null;

  jest.setTimeout(60000);

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    await page.waitForTimeout(2000);
    const tooltipContainer = await frame.waitForSelector(
      `[data-testid="tooltip-container"]`
    );

    const tooltipReference = await frame.waitForSelector(
      "[data-testid='tooltip-reference']"
    );

    await tooltipReference.hover();

    const tooltipScreenshot = await tooltipContainer.screenshot();

    expect(tooltipScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprztooltip`
    );
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Without Title", async () => {
    const explorerNodeId = "disprz-disprztooltip--without-title";
    const fileName = "without-title";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Title", async () => {
    const explorerNodeId = "disprz-disprztooltip--with-title";
    const fileName = "with-title";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Progress Type", async () => {
    const explorerNodeId = "disprz-disprztooltip--progress-type";
    const fileName = "progress-type";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  // Ignoring different positions as they don't have any visual difference
});
