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

const getTodaysDate = () => {
  const date = new Date();
  let todaysDateString;
  let tomorrowsDateString;

  todaysDateString =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);

  return todaysDateString;
};

const getDateRange = () => {
  const date = new Date();
  let todaysDateString;
  let tomorrowsDateString;

  todaysDateString =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);

  tomorrowsDateString =
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + (date.getDate() + 1)).slice(-2);

  return (
    "&from=" +
    todaysDateString +
    "T04:00:00Z&to=" +
    tomorrowsDateString +
    "T03:59:59Z"
  );
};

// @route POST /api/scratch/create
// @desc Create Scratch project; example for 1 student
// @access Public
router.post("/create", async (req, res) => {
  try {
    const fullName = req.body.fullName;
    const project = req.body.project;
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

      const page2 = await browser.newPage();
      await page2.setViewport({ width: 1366, height: 768 });
      await page2.goto(project, {
        waitUntil: "networkidle2",
      });

      await page2.click(".remix-button", {
        waitUntil: "networkidle0",
      });

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

// @route POST /api/scratch/create-schedules
// @desc Create Scratch project
// @access Public
router.post("/create-templates", async (req, res) => {
  try {
    const allNames = req.body.allNames;
    let allCredentials = [];

    allNames.forEach((name) => {
      allCredentials.push(getCredentials(name));
    });

    console.log(allCredentials);

    const createTemplate = async (userCredentials) => {
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

      const page2 = await browser.newPage();
      await page2.setViewport({ width: 1366, height: 768 });
      await page2.goto("https://scratch.mit.edu/projects/716058312/", {
        waitUntil: "networkidle2",
      });

      await page2.click(".remix-button", {
        waitUntil: "networkidle0",
      });

      await delay(1000);
      await browser.close();
    };

    for await (const credentials of allCredentials) {
      await createTemplate(credentials);
    }
    // await createTemplate();

    return res.json("Templates created");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// @route GET /api/scratch/schedule
// @desc Get user's schedule
// @access Public
router.post("/schedule", async (req, res) => {
  try {
    const coachID = req.body.id;
    const coachEmail = req.body.email;

    const getSchedule = async () => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--single-process", "--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });

      const todaysDate = getTodaysDate();

      await page.goto(
        `https://tcs-syosset.pike13.com/today#/list?dt=${todaysDate}&lt=staff`,
        { waitUntil: "networkidle2" }
      );

      await page.type("#account_email", `${coachEmail}`);
      await page.type("#account_password", `${process.env.PASSWORD}`);
      await page.keyboard.press("Enter");
      await delay(2000);

      const baseURL = `https://tcs-syosset.pike13.com/api/v2/desk/staff_members/${coachID}/event_occurrences.json?client_id=${process.env.CLIENT_ID}`;
      const timeString = getDateRange();
      const URL = baseURL + timeString;
      // console.log(URL);

      await page.goto(URL, { waitUntil: "networkidle2" });

      const data = await page.evaluate(
        () => document.querySelector("pre").innerHTML
      );

      return data;
    };

    const fetchedSchedule = await getSchedule();

    // console.log(fetchedSchedule);

    return res.json(fetchedSchedule);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
