const puppeteer = require("puppeteer");
const path = require("path");

describe("Charts and its variants' appearance", () => {
  jest.setTimeout(60000);

  let browser = null;
  let page = null;

  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    // await page.keyboard.press("S");

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const container = await frame.waitForSelector(
      `[data-testid="charts-container"]`
    );

    await page.waitForTimeout(2000);
    const screenshot = await container.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprzcharts`);
    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Svg Bar", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-bar";
    const fileName = "svgbar";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Canvas Bar", async () => {
    const explorerNodeId = "disprz-disprzcharts--canvas-bar";
    const fileName = "canvasbar";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Svg Line", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-line";
    const fileName = "svgline";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Canvas Line", async () => {
    const explorerNodeId = "disprz-disprzcharts--canvas-line";
    const fileName = "canvasline";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Svg Pie", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-pie";
    const fileName = "svgpie";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Canvas Pie", async () => {
    const explorerNodeId = "disprz-disprzcharts--canvas-pie";
    const fileName = "canvaspie";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Svg Doughnut", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-doughnut";
    const fileName = "svgdoughnut";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Svg Funnel", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-funnel";
    const fileName = "svgfunnel";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Svg ScatterPlot", async () => {
    const explorerNodeId = "disprz-disprzcharts--svg-scatter-plot";
    const fileName = "svgscatterplot";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Canvas ScatterPlot", async () => {
    const explorerNodeId = "disprz-disprzcharts--canvas-scatter-plot";
    const fileName = "canvasscatterplot";
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
