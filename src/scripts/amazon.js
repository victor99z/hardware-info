import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../utils/utils.js";
import { init_conf, user_agent } from "../config/puppeteer_conf.js";
import db from "../utils/database.js";
import log from "../config/logger.js";

async function scrapAmazon(items) {
  let price_avista;
  let price_parcelado;

  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // Set user agent and headers to mimic a real browser
  await page.setUserAgent(user_agent);

  try {
    for (const item of items) {
      try {
        await page.goto(item.url, { waitUntil: "networkidle2" });

        // Get the price of the product
        await page
          .waitForSelector("span > span.a-price-whole")
          .then(async (res) => {
            const priceRes = await res?.evaluate((el) => el.textContent);
            price_avista = parseCurrencyToNumber(priceRes);
          });

        let response = await db.createRecord({
          id: item.id,
          price_avista,
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

export default scrapAmazon;
