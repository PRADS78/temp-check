const puppeteer = require("puppeteer");
const path = require("path");

let browser = null;
let page = null;

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

  const toggleButton = await frame.waitForSelector(".toggleButton");
  await toggleButton.click();

  await page.waitForTimeout(1000); // wait for the dialog to open with animation

  const dialogBox = await frame.waitForSelector(`div[class*="dialogBox"]`);
  const dialogBoxScreenshot = await dialogBox.screenshot();
  expect(dialogBoxScreenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("DialogBox and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzdialogbox`
    );
    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzdialogbox--standard";
    const fileName = "standard";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("WithoutTitle", async () => {
    const explorerNodeId = "disprz-disprzdialogbox--without-title";
    const fileName = "without-title";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
});
