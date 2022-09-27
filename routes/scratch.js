const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

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
    const fullName = req.body.fullName;
    let userCredentials = getCredentials(fullName);

    const createTemplate = async () => {
      const browser = await puppeteer.launch({
        headless: false,
        args: ["--single-process", "--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });

      await page.goto("https://scratch.mit.edu", { waitUntil: "networkidle2" });
      await page.click(".ignore-react-onclickoutside");
      await page.type("input[name=username]", userCredentials.username);
      await page.type("input[name=password]", userCredentials.password);
      await page.keyboard.press("Enter");
      await delay(1000);

      const page2 = await browser.newPage();
      await page2.setViewport({ width: 1366, height: 768 });
      await page2.goto("https://scratch.mit.edu/projects/716058312/", {
        waitUntil: "networkidle2",
      });

      await delay(1000);

      await page2.click(".remix-button", {
        waitUntil: "networkidle0",
      });

      console.log(page2.url);

      await delay(1000);
      await browser.close();
    };

    await createTemplate();

    return res.json("Template created");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
