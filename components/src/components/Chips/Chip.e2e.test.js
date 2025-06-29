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
  const container = await frame.waitForSelector(`[id="root"]`);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Chip and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzchip`);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzchip--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("WithClose", async () => {
    const explorerNodeId = "disprz-disprzchip--with-close";
    const fileName = "with_close";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("WithAvatar", async () => {
    const explorerNodeId = "disprz-disprzchip--with-avatar";
    const fileName = "with_avatar";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("LargeChip", async () => {
    const explorerNodeId = "disprz-disprzchip--large-chip";
    const fileName = "large_chip";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("SingleChoice", async () => {
    const explorerNodeId = "disprz-disprzchip--single-choice";
    const fileName = "single_choice";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("MultipleChoice", async () => {
    const explorerNodeId = "disprz-disprzchip--multiple-choice";
    const fileName = "multiple_choice";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
