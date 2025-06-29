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
    `[data-testid="stepper-container"]`
  );

  const firstNextButton = await container.$(".first-next");
  await firstNextButton.click();
  await page.waitForTimeout(600);

  const cursorTrap = await container.$("#cursor-trap");
  await cursorTrap.click();
  await page.waitForTimeout(2000);

  const screenshot = await container.screenshot();

  expect(screenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
    failureThreshold: 0.1,
    failureThresholdType: "percent",
  });
};

describe("Stepper and its variants' appearance", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      `#disprz-disprzstepper`
    );
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });
  jest.setTimeout(60000);

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprzstepper--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
