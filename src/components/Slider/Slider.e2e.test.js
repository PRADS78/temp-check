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
  const container = await frame.waitForSelector("#root");

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Slider and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzslider`);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzslider--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Discrete", async () => {
    const explorerNodeId = "disprz-disprzslider--discrete";
    const fileName = "discrete";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("BigSlider", async () => {
    const explorerNodeId = "disprz-disprzslider--big-slider";
    const fileName = "bigSlider";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("DefaultValue", async () => {
    const explorerNodeId = "disprz-disprzslider--default-value";
    const fileName = "defaultValue";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprzslider--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
