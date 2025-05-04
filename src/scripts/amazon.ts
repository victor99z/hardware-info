import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../utils/utils";
import { init_conf, user_agent } from "../config/puppeteer_conf";

async function scrapAmazon(url: string) {
    let title: string | undefined;
    let price: number | undefined;

    const browser = await puppeteer.launch(init_conf);
    const page = await browser.newPage();

    try {
        // Set user agent and headers to mimic a real browser
        await page.setUserAgent(user_agent);

        // Navigate to the target page
        await page.goto(url, { waitUntil: "networkidle2" });
        // Create a promise to wait for 5 seconds
        // await new Promise((resolve) => setTimeout(resolve, 5000)); // 3-second delay

        // Get product title
        await page.waitForSelector("span#productTitle").then(async (rawTitle) => {
            const fullTitle = await rawTitle?.evaluate((el) => el.textContent);
            title = fullTitle;
        });

        // Get the price of the product
        await page.waitForSelector("span > span.a-price-whole").then(async (res) => {
            const priceRes = await res?.evaluate((el) => el.textContent);
            price = parseCurrencyToNumber(priceRes)
        });

        return { title, price };
    } catch (error) {
        console.error("Error scraping the page:", error);
    } finally {
        await browser.close();
    }
    return { title, price };
}

export default scrapAmazon