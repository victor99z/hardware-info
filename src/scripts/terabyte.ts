import puppeteer from "puppeteer";
import parseCurrencyToNumber from "../utils/utils";
import { init_conf, user_agent } from "../config/puppeteer_conf";

async function ScrapTera(url: string) {
  let title: string | undefined;
  let price: number | undefined;

  const browser = await puppeteer.launch(init_conf);
  const page = await browser.newPage();

  // const url =
  //   "https://www.pichau.com.br/processador-amd-ryzen-7-9800x3d-8-core-16-threads-4-7ghz-5-2ghz-turbo-cache-104mb-100-1000001084wof";
  // const cookiesPath = "./cookies.json";

  try {
    // Set user agent and headers to mimic a real browser
    await page.setUserAgent(user_agent);

    // Navigate to the target page
    await page.goto(url, { waitUntil: "networkidle2" });
    // Create a promise to wait for 5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // 3-second delay

    // Get product title
    await page.waitForSelector("h1.tit-prod").then(async (rawTitle) => {
      const fullTitle = await rawTitle?.evaluate((el) => el.textContent);
      title = fullTitle;
    });

    // Get the price of the product
    await page.waitForSelector("p#valVista").then(async (res) => {
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

export default ScrapTera