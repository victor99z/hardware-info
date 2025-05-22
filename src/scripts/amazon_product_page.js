import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../utils/utils.js";
import { init_conf, user_agent } from "../config/puppeteer_conf.js";
import db from "../utils/database.js";
import log from "../config/logger.js";

async function ScrapAmazonByPage(items) {
  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // Set user agent and headers to mimic a real browser
  await page.setUserAgent(user_agent);

  try {
    for (const item of items) {
      try {
        // Navigate to the target page
        await page.goto(item.url, { waitUntil: "networkidle2" });

        try {
          const productElements = await page.$$('div[role="listitem"]');

          for (const productElement of productElements) {
            try {
              // Extract price
              const priceElement = await productElement.$(
                'span[class*="a-price-whole"]'
              );
              if (!priceElement) {
                log.error("Price element not found for a product");
                continue; // Skip to next product instead of breaking
              }

              const priceText = await page.evaluate(
                (el) => el.textContent.trim(),
                priceElement
              );
              const priceValue = parseCurrencyToNumber(priceText);

              // Extract title
              const titleElement = await productElement.$("span");
              if (!titleElement) {
                log.error("Title element not found for a product");
                continue;
              }

              const titleText = await page.evaluate(
                (el) => el.textContent.trim(),
                titleElement
              );

              // Extract URL (fixed: was trying to use $('href') incorrectly)
              let href = await productElement.$('a[class*="a-link-normal"]');
              href = await page.evaluate((el) => el.getAttribute("href"), href);
              if (!href) {
                log.error("URL not found for product");
                continue;
              }

              // Construct full URL if needed (if href is relative)
              const fullUrl = new URL(href, item.url).toString();

              // Save to database
              await db.createPriceRecord({
                price: priceValue,
                url: fullUrl,
                title: titleText,
              });

              console.log({
                price: priceValue,
                url: fullUrl,
                title: titleText,
              });
            } catch (error) {
              log.error(`Error processing product: ${error.message}`);
              continue;
            }
          }

          log.info(`Successfully scraped: ${item.url}`);
        } catch (error) {
          log.error(`Scraping failed for ${item.url}: ${error.message}`);
        }
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

export default ScrapAmazonByPage;
