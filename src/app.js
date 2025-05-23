import log from "./config/logger.js";
import db from "./utils/database.js";
import cron from "node-cron";
import ScrapPichauByPage from "./scripts/pichau_product_page.js";
import ScrapGKINFOStoreByPage from "./scripts/gkinfostore_product_page.js";
import ScrapTeraByPage from "./scripts/terabyte_product_page.js";
import ScrapKabumByPage from "./scripts/kabum_product_page.js";
import ScrapAmazonByPage from "./scripts/amazon_product_page.js";
import ScrapPatoloucoByPage from "./scripts/patolouco_product_page.js";
import "dotenv/config";

const runScrap = async (store, scrapFunction) => {
  try {
    let items = await scrapFunction();
  } catch (e) {
    log.error(e);
  }
};

const filterByStore = async (store, item) => {
  let random = Math.floor(Math.random() * 10000) + 1;
  await new Promise((resolve) => setTimeout(resolve, random));
  if (!item || item.length === 0) {
    log.error("store and item empty");
    throw new Error("store and item empty");
  }
  if (store.includes("www.terabyteshop.com.br")) {
    runScrap(store, () => ScrapTeraByPage(item));
  }
  if (store.includes("www.pichau.com.br")) {
    runScrap(store, () => ScrapPichauByPage(item));
  }
  if (store.includes("www.kabum.com.br")) {
    runScrap(store, () => ScrapKabumByPage(item));
  }
  if (store.includes("www.amazon.com.br")) {
    await runScrap(store, () => ScrapAmazonByPage(item));
  }
  if (store.includes("www.gkinfostore.com.br")) {
    await runScrap(store, () => ScrapGKINFOStoreByPage(item));
  }
  if (store.includes("www.patoloco.com.br")) {
    await runScrap(store, () => ScrapPatoloucoByPage(item));
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
  // let list = await db.listAllProducts();
  let list = await db.listAllWholePagesUrls();
  let res = groupByUrl(list);
  for (const [key, value] of Object.entries(res)) {
    const storeName = key.padEnd(30, " "); // Ajusta o comprimento do nome da loja para 30 caracteres
    const itemCount = value.length.toString().padStart(5, " "); // Ajusta o comprimento do número de itens para 5 caracteres
    await filterByStore(key, value);
  }
};

cron.schedule("*/5 * * * *", async () => {
  log.info("Running cron job");
  try {
    await runner();
  } catch (e) {
    log.error(e);
  }
});
// await runner();
