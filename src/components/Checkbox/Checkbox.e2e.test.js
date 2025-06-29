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
    `[data-testid="checkbox-container"]`
  );

  const checkbox = await container.$(`input[type="checkbox"`);
  await checkbox.click();
  await page.waitForTimeout(2000);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Checkbox and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzcheckbox`
    );
    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzcheckbox--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
