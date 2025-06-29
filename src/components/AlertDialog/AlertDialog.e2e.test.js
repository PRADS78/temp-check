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

  const toggleButton = await frame.waitForSelector(".toggleButton");
  await toggleButton.click();

  await page.waitForTimeout(1000); // wait for the dialog to open with animation

  const dialogBox = await frame.waitForSelector(`div[class*="alertDialog"]`);
  const dialogBoxScreenshot = await dialogBox.screenshot();
  expect(dialogBoxScreenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("AlertDialog and its variants' appearance", () => {
  jest.setTimeout(80000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzalertdialog`
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

  test("Error", async () => {
    const explorerNodeId = "disprz-disprzalertdialog--error";
    const fileName = "error";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Success", async () => {
    const explorerNodeId = "disprz-disprzalertdialog--success";
    const fileName = "success";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Warning", async () => {
    const explorerNodeId = "disprz-disprzalertdialog--warning";
    const fileName = "warning";
    return await runScreenshotTest({ explorerNodeId, fileName });
  });
});
