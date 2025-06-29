const puppeteer = require("puppeteer");
const path = require("path");

describe("Toggletip  and its variants' appearance", () => {
  let browser = null;
  let page = null;

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    await page.waitForTimeout(2000);
    const tooltipContainer = await frame.waitForSelector(
      `[data-testid="toggletip-container"]`
    );

    const tooltipReference = await frame.waitForSelector(
      "[data-role='info-icon']"
    );

    await tooltipReference.click();

    const tooltipScreenshot = await tooltipContainer.screenshot();

    expect(tooltipScreenshot).toMatchImageSnapshot({
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
      `#disprz-disprztoggletip`
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

  test("Custom Content One", async () => {
    const explorerNodeId = "disprz-disprztoggletip--custom-content-one";
    const fileName = "custom-content-one";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Custom Content Two", async () => {
    const explorerNodeId = "disprz-disprztoggletip--custom-content-two";
    const fileName = "custom-content-two";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
