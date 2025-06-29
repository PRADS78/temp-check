const puppeteer = require("puppeteer");
const path = require("path");

let browser = null;
let page = null;

describe("Table with it's options appearance", () => {
  const runScreenshotTest = async ({ explorerNodeId, fileName }) => {
    const screenshotPath = path.join(__dirname, "snapshots");

    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    await page.keyboard.press("S");

    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const container = await frame.waitForSelector(
      `[data-testid="table-container"]`
    );

    await page.waitForTimeout(2000);
    const screenshot = await container.screenshot();

    expect(screenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  jest.setTimeout(50000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });

    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(`#disprz-disprztable`);
    await storyGroupButton.click();

    const hideAddonsButton = await page.waitForSelector(
      `[title="Hide addons [A]"]`
    );
    return await hideAddonsButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  test("Standard", async () => {
    const explorerNodeId = "disprz-disprztable--standard";
    const fileName = "standard";
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("With Search", async () => {
    const explorerNodeId = "disprz-disprztable--with-search";
    const fileName = "with-search";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Row Multi Select", async () => {
    const explorerNodeId = "disprz-disprztable--row-selection-multi";
    const fileName = "row-multi-select";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Row Single Select", async () => {
    const explorerNodeId = "disprz-disprztable--row-selection-single";
    const fileName = "row-single-select";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table without total count", async () => {
    const explorerNodeId = "disprz-disprztable--without-total-count";
    const fileName = "table-without-count";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table with actions", async () => {
    const explorerNodeId = "disprz-disprztable--with-table-actions";
    const fileName = "table-with-actions";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table column clickable", async () => {
    const explorerNodeId = "disprz-disprztable--column-clickable";
    const fileName = "table--column-clickable";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table with filters", async () => {
    const explorerNodeId = "disprz-disprztable--table-with-filter";
    const fileName = "table--with-filter";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table with pre selected filters", async () => {
    const explorerNodeId = "disprz-disprztable--table-with-filter-pre-applied";
    const fileName = "table--with-pre-selected-filter";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table with global filters", async () => {
    const explorerNodeId = "disprz-disprztable--table-with-global-filters";
    const fileName = "table--with-global-filters";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });

  test("Table with pre selected global filters", async () => {
    const explorerNodeId =
      "disprz-disprztable--table-with-pre-applied-global-filters";
    const fileName = "table--with-pre-selected-global-filters";
    await page.keyboard.press("S");
    await runScreenshotTest({ explorerNodeId, fileName });
  });
});
