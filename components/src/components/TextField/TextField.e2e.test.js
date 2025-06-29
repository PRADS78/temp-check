const puppeteer = require("puppeteer");
const path = require("path");

describe("TextField and its variants' appearance", () => {
  jest.setTimeout(120000);
  let browser;
  let page = null;
  let screenshotPath = path.join(__dirname, "snapshots");

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 768 },
    });
    page = await browser.newPage();
    await page.goto("http://localhost:6006", { waitUntil: "networkidle2" });

    const storyGroupButton = await page.waitForSelector(
      "#disprz-disprztextfield"
    );
    return storyGroupButton.click();
  });

  afterAll(() => {
    browser.close();
  });

  const runStandardScreenshotTest = async ({
    explorerNodeId,
    fileName,
    browserInteraction,
  }) => {
    const explorerNode = await page.waitForSelector(`#${explorerNodeId}`);
    await explorerNode.click();

    const { textFieldContainer } = await browserInteraction({ page, fileName });

    const textFieldScreenshot = await textFieldContainer.screenshot();
    expect(textFieldScreenshot).toMatchImageSnapshot({
      customSnapshotsDir: screenshotPath,
      customSnapshotIdentifier: fileName,
    });
  };

  const browserInteraction = async ({ page, fileName }) => {
    const frameHandle = await page.$("iframe");
    const frame = await frameHandle.contentFrame();
    const containerSelector = '[data-testid="text-field-container"]';
    const textFieldContainer = await frame.waitForSelector(containerSelector);

    if (fileName === "keyword-creation") {
      const labelElement = await textFieldContainer.$("svg");
      await labelElement.click();
    }

    const textFieldInput = await frame.waitForSelector(
      `${containerSelector} input`
    );

    if (fileName !== "isDisabled") {
      await textFieldInput.focus();
      await textFieldInput.type("text", { delay: 100 });
    }

    if (fileName === "keyword-selection") {
      await textFieldInput.press("Enter");
      await page.waitForTimeout(400);
    }

    if (fileName === "password-visible") {
      const visibilityButton = await textFieldContainer.$("button");
      await visibilityButton.click();
    }

    return { textFieldContainer };
  };

  describe("standard variants", () => {
    test("standard", async () => {
      const explorerNodeId = "disprz-disprztextfield--standard";
      const fileName = "standard";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });

    test("with title", async () => {
      const explorerNodeId = "disprz-disprztextfield--with-title";
      const fileName = "with-title";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });

    test("with help text", async () => {
      const explorerNodeId = "disprz-disprztextfield--help-text";
      const fileName = "with-help-text";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });

    test("isDisabled", async () => {
      const explorerNodeId = "disprz-disprztextfield--disabled";
      const fileName = "isDisabled";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });
  });

  describe("password variant", () => {
    test("password visible", async () => {
      const explorerNodeId = "disprz-disprztextfield--password";
      const fileName = "password-invisible";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });

    test("password invisible", async () => {
      const explorerNodeId = "disprz-disprztextfield--password";
      const fileName = "password-visible";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });

    test("error message", async () => {
      const explorerNodeId = "disprz-disprztextfield--error-message";
      const fileName = "error-message";
      await runStandardScreenshotTest({
        explorerNodeId,
        fileName,
        browserInteraction,
      });
    });
  });

  // describe("keyword variant", () => {
  //   test("keyword creation", async () => {
  //     const explorerNodeId = "disprz-disprztextfield--keyword";
  //     const fileName = "keyword-creation";
  //     await runStandardScreenshotTest({
  //       explorerNodeId,
  //       fileName,
  //       browserInteraction,
  //     });
  //   });

  //   test("keyword selection", async () => {
  //     const explorerNodeId = "disprz-disprztextfield--keyword";
  //     const fileName = "keyword-selection";
  //     await runStandardScreenshotTest({
  //       explorerNodeId,
  //       fileName,
  //       browserInteraction,
  //     });
  //   });
  // });
});
