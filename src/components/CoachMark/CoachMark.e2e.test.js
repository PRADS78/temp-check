const puppeteer = require("puppeteer");
const path = require("path");

describe("CoachMark  and its variants' appearance", () => {
  let browser = null;
  let page = null;

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    await page.waitForTimeout(4000);
    const coachMarkContainer = await frame.waitForSelector(
      `div[class*="coachMarkContainer"]`
    );

    const coachMarkScreenshot = await coachMarkContainer.screenshot();

    expect(coachMarkScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzcoachmark`
    );
    await storyGroupButton.click();
    const hideAddonsButton = await page.waitForSelector(
      `[title="Hide addons [A]"]`
    );
    return await hideAddonsButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzcoachmark--standard";
    const fileName = "Standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
