const puppeteer = require("puppeteer");
const path = require("path");

let browser = null;
let page = null;

const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
  const screenshotPath = path.join(__dirname, "snapshots");

  const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
  await explorerNode.click();

  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  const container = await frame.waitForSelector(
    '[data-testid="text-area-container"]'
  );

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("TextArea and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprztextarea`
    );
    return await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprztextarea--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Limitless", async () => {
    const explorerNodeId = "disprz-disprztextarea--limitless";
    const fileName = "limitless";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprztextarea--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("MinHeight", async () => {
    const explorerNodeId = "disprz-disprztextarea--min-height";
    const fileName = "min-height";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
