import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../utils/utils.js";
import { init_conf, user_agent } from "../config/puppeteer_conf.js";
import db from "../utils/database.js";
import log from "../config/logger.js";

async function ScrapPichauByPage(items) {
  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // Set user agent and headers to mimic a real browser
  await page.setUserAgent(user_agent);

  try {
    for (const item of items) {
      try {
        // Navigate to the target page
        await page.goto(item.url, { waitUntil: "networkidle2" });

        const productElements = await page.$$('a[data-cy="list-product"]'); 

        for (const productElement of productElements) {
          const priceElement = await productElement.$(
            'div[class*="price_vista"]'
          ); // Find price within each product

          if (priceElement) {
            const priceText = await page.evaluate(
              (el) => el.textContent,
              priceElement
            );

            const titleElement = await productElement.$(
              'h2[class*="product_info_title"]'
            ); // Find title within each product

            if (titleElement) {
              const titleText = await page.evaluate(
                (el) => el.textContent,
                titleElement
              );
            } else {
              log.error("Title element not found for a product");
            }

            const href_url = await productElement.$('href');
              
            db.createPriceRecord({
              price: parseCurrencyToNumber(priceText.trim()),
              url: href_url,
              title: titleText.trim()
            });
            
            log.info("Extracted Title:", titleText.trim()); 
            log.info("Extracted Price:", priceText.trim());
          } else {
            log.error("Price element not found for a cpu");
            break; // Exit loop if no price element is found
          }
        }

        log.info(`Scraped successfully: ${item.url}`);
      } catch (error) {
        log.error("Error scraping item: ", error);
      }
    }
  } catch (error) {
    log.error("Error scraping item: ", error);
  } finally {
    await browser.close();
  }
}

export default ScrapPichauByPage;
