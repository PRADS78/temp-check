import { toMatchImageSnapshot } from "jest-image-snapshot";
const puppeteer = require("puppeteer");
const path = require("path");
expect.extend({ toMatchImageSnapshot });

let browser = null;
let page = null;

const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
  const screenshotPath = path.join(__dirname, "snapshots");

  const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
  await explorerNode.click();
  await page.waitForTimeout(1500);

  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  const container = await frame.waitForSelector(`[data-testid="progressbar"]`);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Progressbar and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzprogressbar`
    );
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzprogressbar--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Big Line", async () => {
    const explorerNodeId = "disprz-disprzprogressbar--big-line";
    const fileName = "bigLine";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
