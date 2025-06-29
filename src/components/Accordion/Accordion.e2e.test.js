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
    `[data-testid="accordion-container"]`
  );

  await page.waitForTimeout(2000);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Accordion and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzaccordion`
    );
    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzaccordion--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Action Button", async () => {
    const explorerNodeId = "disprz-disprzaccordion--with-action-buttons";
    const fileName = "with-action-buttons";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Custom Action Button", async () => {
    const explorerNodeId = "disprz-disprzaccordion--with-custom-actions";
    const fileName = "with-custom-actions";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
