import log from "./config/logger.js";
import ScrapPichau from "./scripts/pichau.js";
import ScrapKabum from "./scripts/kabum.js";
import ScrapTera from "./scripts/terabyte.js";
import scrapAmazon from "./scripts/amazon.js";
import db from "./utils/database.js";
import cron from "node-cron";

const runScrap = async (store, scrapFunction) => {
  try {
    let items = await scrapFunction();
  } catch (e) {
    log.error(e);
  }
};

const filterByStore = async (store, item) => {
  if (!item || item.length === 0) {
    log.error("store and item empty");
    throw new Error("store and item empty");
  }
  if (store.includes("www.terabyteshop.com.br")) {
    runScrap(store, () => ScrapTera(item));
  }
  if (store.includes("www.pichau.com.br")) {
    runScrap(store, () => ScrapPichau(item));
  }
  if (store.includes("www.kabum.com.br")) {
    runScrap(store, () => ScrapKabum(item));
  }
  if (store.includes("www.amazon.com.br")) {
    runScrap(store, () => scrapAmazon(item));
  }
};

// create a function to group by url
const groupByUrl = (list) => {
  let grouped = {};
  list.forEach((item) => {
    let store = item.url.match(/www.(.*?).com.br/);
    if (store === null) {
      log.error("Store is undefined");
      throw new Error("Store is undefined");
    }
    if (!grouped[store[0].toString()]) {
      grouped[store[0].toString()] = [];
    }
    grouped[store[0].toString()].push(item);
  });
  return grouped;
};

const runner = async () => {
  let list = await db.listAllProducts();
  let res = groupByUrl(list);

  for (const [key, value] of Object.entries(res)) {
    const storeName = key.padEnd(30, " "); // Ajusta o comprimento do nome da loja para 30 caracteres
    const itemCount = value.length.toString().padStart(5, " "); // Ajusta o comprimento do número de itens para 5 caracteres
    log.info(`Scraping ${storeName} ${itemCount} items`);
    await filterByStore(key, value);
  }
};

// Schedule the job to run every hour "0 * * * *"
// every 15 minutes "*/15 * * * *"
cron.schedule("*/10 * * * *", async () => {
  log.info("Running scheduled job...");
  await runner();
});
