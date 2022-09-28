const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const chromeLauncher = require("chrome-launcher");
const request = require("request");
const util = require("util");

const getCredentials = (fullName) => {
  const splitName = fullName.split(" ");
  const firstName = splitName[0];
  const lastName = splitName[1];

  const user = firstName[0] + lastName + "-tcss";
  const pw = firstName[0] + lastName[0] + "coder";
  return { username: user.toLowerCase(), password: pw.toLowerCase() };
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// @route POST /api/scratch/create
// @desc Create Scratch project
// @access Public
router.post("/create", async (req, res) => {
  try {
    const userCredentials = getCredentials(req.body.fullName);
    const URL = "https://scratch.mit.edu";

    const opts = {
      // chromeFlags: ["--headless"],
      logLevel: "info",
      output: "json",
    };

    // Chromium must be no older than Chrome stable
    const chrome = await chromeLauncher.launch(opts);
    opts.port = chrome.port;

    // Connect to it using puppeteer.connect().
    const resp = await util.promisify(request)(
      `http://localhost:${opts.port}/json/version`
    );
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(URL, { waitUntil: "networkidle2" });
    await page.click(".ignore-react-onclickoutside");
    await page.type("input[name=username]", userCredentials.username);
    await page.type("input[name=password]", userCredentials.password);
    await page.keyboard.press("Enter");
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1366, height: 768 });
    await page2.goto("https://scratch.mit.edu/projects/716058312/", {
      waitUntil: "networkidle2",
    });

    await delay(3000);

    await page2.click(".remix-button", {
      waitUntil: "networkidle0",
    });

    // Run Lighthouse.
    // const { lhr } = await lighthouse(URL, opts, null);
    // console.log(
    //   `Lighthouse scores: ${Object.values(lhr.categories)
    //     .map((c) => `${c.title} ${c.score}`)
    //     .join(", ")}`
    // );

    // await browser.disconnect();
    // await chrome.kill();

    // const fullName = req.body.fullName;
    // let userCredentials = getCredentials(fullName);

    // const createTemplate = async () => {
    //   const browser = await puppeteer.launch({
    //     headless: false,
    //     args: ["--single-process", "--no-sandbox", "--disable-setuid-sandbox"],
    //   });

    //   const page = await browser.newPage();
    //   await page.setViewport({ width: 1366, height: 768 });

    //   await page.goto("https://scratch.mit.edu", { waitUntil: "networkidle2" });
    //   await page.click(".ignore-react-onclickoutside");
    //   await page.type("input[name=username]", userCredentials.username);
    //   await page.type("input[name=password]", userCredentials.password);
    //   await page.keyboard.press("Enter");
    //   await delay(3000);

    //   const page2 = await browser.newPage();
    //   await page2.setViewport({ width: 1366, height: 768 });
    //   await page2.goto("https://scratch.mit.edu/projects/716058312/", {
    //     waitUntil: "networkidle2",
    //   });

    //   await delay(3000);

    //   await page2.click(".remix-button", {
    //     waitUntil: "networkidle0",
    //   });

    //   // console.log(page2.url);

    //   await delay(1000);
    //   await browser.close();
    // };

    // await createTemplate();

    // return res.json("Template created");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
