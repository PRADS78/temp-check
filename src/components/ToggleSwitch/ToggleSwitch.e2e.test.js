const puppeteer = require("puppeteer");
const path = require("path");

describe("Toggle Switch and it's variants appearance", () => {
  let browser = null;
  let page = null;
  jest.setTimeout(100000);

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const buttonContainer = await frame.waitForSelector("#root");

    const buttonScreenshot = await buttonContainer.screenshot();

    expect(buttonScreenshot).toMatchImageSnapshot({
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
      `#disprz-disprztoggleswitch`
    );
    await page.waitForTimeout(2000);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprztoggleswitch--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Small", async () => {
    const explorerNodeId = "disprz-disprztoggleswitch--small";
    const fileName = "small";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprztoggleswitch--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
