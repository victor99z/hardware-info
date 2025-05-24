import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../../utils/utils.js";
import { init_conf, user_agent } from "../../config/puppeteer_conf.js";
import db from "../../utils/database.js";
import log from "../../config/logger.js";

// recebe uma lista de urls da loja kabum
async function ScrapKabumByPage(items) {
  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // Set user agent and headers to mimic a real browser
  await page.setUserAgent(user_agent);

  try {
    for (const item of items) {
      try {
        // Navigate to the target page
        const final_url =
          item.url +
          "?page_number=1&page_size=20000&facet_filters=&sort=most_searched";
        await page.goto(final_url, { waitUntil: "networkidle2" });

        try {
          const productElements = await page.$$("article.productCard");

          for (const productElement of productElements) {
            try {
              // Extract price
              const priceElement = await productElement.$(
                'span[class*="priceCard"]'
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
              const titleElement = await productElement.$(
                'span[class*="nameCard"]'
              );
              if (!titleElement) {
                log.error("Title element not found for a product");
                continue;
              }

              const titleText = await page.evaluate(
                (el) => el.textContent.trim(),
                titleElement
              );

              // Extract URL (fixed: was trying to use $('href') incorrectly)
              let href = await productElement.$('a[class*="productLink"]');
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

              log.info(`Extracted: ${fullUrl} | ${priceValue} `);
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
    // pause for 5 seconds to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    log.error("Error scraping item: ", error);
  } finally {
    await browser.close();
  }
}

export default ScrapKabumByPage;
