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
  const buttonContainer = await frame.waitForSelector("#button-container");

  const buttonScreenshot = await buttonContainer.screenshot();

  expect(buttonScreenshot).toMatchImageSnapshot({
    customSnapshotsDir: screenshotPath,
    customSnapshotIdentifier: fileName,
  });
};

describe("AppButton and its variants' appearance", () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzbutton`);
    await storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Primary", async () => {
    const explorerNodeId = "disprz-disprzbutton--primary";
    const fileName = "primary";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Outlined", async () => {
    const explorerNodeId = "disprz-disprzbutton--outlined";
    const fileName = "outlined";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Plain", async () => {
    const explorerNodeId = "disprz-disprzbutton--plain";
    const fileName = "plain";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Disabled", async () => {
    const explorerNodeId = "disprz-disprzbutton--disabled";
    const fileName = "disabled";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("WithIcon", async () => {
    const explorerNodeId = "disprz-disprzbutton--with-icon";
    const fileName = "with-icon";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("FloatingAction", async () => {
    const explorerNodeId = "disprz-disprzbutton--floating-action";
    const fileName = "floating-action";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("DropDown", async () => {
    const explorerNodeId = "disprz-disprzbutton--drop-down";
    const fileName = "drop-down";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Small", async () => {
    const explorerNodeId = "disprz-disprzbutton--small-button";
    const fileName = "small";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("EndToEnd", async () => {
    const explorerNodeId = "disprz-disprzbutton--end-to-end";
    const fileName = "end-to-end";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("WithIcon", async () => {
    const explorerNodeId = "disprz-disprzbutton--with-icon";
    const fileName = "with-icon";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Hyperlink", async () => {
    const explorerNodeId = "disprz-disprzbutton--hyperlink";
    const fileName = "hyperlink";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
