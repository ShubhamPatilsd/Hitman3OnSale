const puppeteer = require("puppeteer");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.xbox.com/en-US/games/store/hitman-3---standard-edition/9PF0R4MP0MW7"
  );

  const element = await page.$(".Price-module__boldText___34T2w");

  //   console.log(element);

  const value = await element.evaluate((el) => el.textContent);
  if (
    parseFloat(value.substring(1, value.length - 1)) * 100 <
    parseFloat(fs.readFileSync("./yesterday.txt").toString()) * 100
  ) {
    console.log("On sale");
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "shubhampatilsd@gmail.com", // sender address
      to: "shubhampatilsd@gmail.com", // list of receivers
      subject: "Hitman 3 on sale", // Subject line
      text: "Hitman 3 is now on sale for Xbox at " + value, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  try {
    fs.writeFileSync("./yesterday.txt", value.substring(1, value.length - 1));
  } catch (err) {
    console.log(err);
  }

  await browser.close();
})();
