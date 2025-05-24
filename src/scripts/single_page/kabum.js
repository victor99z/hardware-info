import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../../utils/utils.js";
import { init_conf, user_agent } from "../../config/puppeteer_conf.js";
import db from "../../utils/database.js";
import log from "../../config/logger.js";

async function ScrapKabum(items) {
  let price_avista;
  let price_parcelado;

  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // Set user agent and headers to mimic a real browser
  await page.setUserAgent(user_agent);

  try {
    for (const item of items) {
      try {
        // Navigate to the target page
        await page.goto(item.url, { waitUntil: "networkidle2" });

        // Get the price of the product
        await page.waitForSelector("h4.finalPrice").then(async (res) => {
          let val = await page.$$eval("h4.finalPrice", (elements) => {
            return elements.map((e) => e.textContent);
          });
          price_avista = parseCurrencyToNumber(val[0]);
        });

        await page.waitForSelector("b.regularPrice").then(async (res) => {
          let val = await page.$$eval("b.regularPrice", (elements) => {
            return elements.map((e) => e.textContent);
          });
          price_parcelado = parseCurrencyToNumber(val[0]);
        });

        let response = await db.createRecord({
          id: item.id,
          price_avista,
          price_parcelado,
        });
        log.info(`Scraped successfully: ${item.url}`);
      } catch (error) {
        log.error("Error scraping item: ", error);
      }
    }
  } catch (error) {
    log.error("Error scraping the page:", error);
  } finally {
    await browser.close();
  }
}

export default ScrapKabum;
