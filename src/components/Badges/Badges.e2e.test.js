const puppeteer = require("puppeteer");
const path = require("path");

describe("Badges and it's variants", () => {
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

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzbadges`);
    await storyGroupButton.click();
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
    const buttonContainer = await frame.waitForSelector("#badges-container");

    const buttonScreenshot = await buttonContainer.screenshot();

    expect(buttonScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzbadges--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Numbered", async () => {
    const explorerNodeId = "disprz-disprzbadges--numbered";
    const fileName = "numbered";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Max Number", async () => {
    const explorerNodeId = "disprz-disprzbadges--max-number";
    const fileName = "max-number";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
