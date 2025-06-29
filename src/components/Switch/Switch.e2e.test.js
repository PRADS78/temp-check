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

  const frameHandle = await page.$("iframe");
  const frame = await frameHandle.contentFrame();
  const container = await frame.waitForSelector(
    `[data-testid="switch-container"]`
  );
  const checkbox = await container.$(`input[type="checkbox"]`);
  await checkbox.click();
  await page.waitForTimeout(500);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("Switch and its variants' appearance", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzswitch`);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  jest.setTimeout(60000);

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzswitch--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprzswitch--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
