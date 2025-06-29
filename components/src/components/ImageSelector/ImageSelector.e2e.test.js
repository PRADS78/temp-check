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
  const container = await frame.waitForSelector(
    `[data-testid="imageSelector"]`
  );

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("ImageSelector and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzimageselector`
    );
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzimageselector--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("base64", async () => {
    const explorerNodeId = "disprz-disprzimageselector--base-64";
    const fileName = "base64";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("withDefaultSource", async () => {
    const explorerNodeId = "disprz-disprzimageselector--with-default-source";
    const fileName = "withDefaultSource";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
  test("withPreviewAndText", async () => {
    const explorerNodeId = "disprz-disprzimageselector--with-preview-and-text";
    const fileName = "withPreviewAndText";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
