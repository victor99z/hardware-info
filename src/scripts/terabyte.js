import puppeteer from "puppeteer";
import log from "../config/logger.js";
import parseCurrencyToNumber from "../utils/utils.js";
import { init_conf, user_agent } from "../config/puppeteer_conf.js";
import db from "../utils/database.js";

async function ScrapTera(items) {
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
        await page.goto(item.url, { waitUntil: "networkidle2", slowMo: 1000 });

        // Get the price of the product
        await page.waitForSelector("p#valVista").then(async (res) => {
          const priceRes = await res?.evaluate((el) => el.textContent);
          price_avista = parseCurrencyToNumber(priceRes);
        });

        // Get the price of the product
        await page.waitForSelector("span#valParc").then(async (res) => {
          const priceRes = await res?.evaluate((el) => el.textContent);
          price_parcelado = parseCurrencyToNumber(priceRes);
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
    log.error("Error scraping data: ", error);
  } finally {
    await browser.close();
  }
}

export default ScrapTera;
