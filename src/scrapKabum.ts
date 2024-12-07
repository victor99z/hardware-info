import puppeteer from "puppeteer";
import parseCurrencyToNumber from "./utils";

async function ScrapKabum(url: string) {
  let title: string | undefined;
  let price: number | undefined;

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized"],
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
  });
  const page = await browser.newPage();

  // const url =
  //   "https://www.pichau.com.br/processador-amd-ryzen-7-9800x3d-8-core-16-threads-4-7ghz-5-2ghz-turbo-cache-104mb-100-1000001084wof";
  // const cookiesPath = "./cookies.json";

  try {
    // Set user agent and headers to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
    );

    // Navigate to the target page
    await page.goto(url, { waitUntil: "networkidle2" });
    // Create a promise to wait for 5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // 3-second delay

    // Get product title
    await page
      .waitForSelector("#container-purchase > div > div > h1")
      .then(async (rawTitle) => {
        const fullTitle = await rawTitle?.evaluate((el) => el.textContent);
        title = fullTitle;
      });

    // Get the price of the product
    await page.waitForSelector("h4.finalPrice").then(async (res) => {
      let val = await page.$$eval("h4.finalPrice", (elements) => {
        return elements.map((e) => e.textContent);
      });
      price = parseCurrencyToNumber(val[0]);
    });

    return { title, price };
  } catch (error) {
    console.error("Error scraping the page:", error);
  } finally {
    await browser.close();
  }
  return { title, price };
}

export default ScrapKabum;
