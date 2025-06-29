const puppeteer = require("puppeteer");
const path = require("path");

describe("Counter and its variants' appearance", () => {
  let browser = null;
  let page = null;

  jest.setTimeout(60000);
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzcounter`
    );
    await storyGroupButton.click();

    const hideAddonsButton = await page.waitForSelector(
      '[title="Hide addons [A]"]'
    );
    await hideAddonsButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const container = await frame.waitForSelector(
      `[data-testid="counter-container"]`
    );

    const screenshot = await container.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzcounter--standard";
    const fileName = "primary";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprzcounter--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
