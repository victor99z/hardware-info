import ScrapPichau from "./scrapPichau";
import readCSV from "./readCSV";
import storage from "./storage";
import ScrapKabum from "./scrapKabum";
import ScrapTera from "./scrapTerabyte";
import log from "./logger";
import cron from "node-cron";

type url = {
  url: string;
};

const runScrap = async (url: string, scrapFunction: () => Promise<any>) => {
  try {
    let items = await scrapFunction();

    if (items.price === undefined) {
      log.error("Price is undefined");
      throw new Error("Price is undefined");
    }
    if (items.title === undefined) {
      log.error("Title is undefined");
      throw new Error("Title is undefined");
    }

    // create a regex to get the store from url and store in a variable just the matched part
    let store = url.match(/www.(.*?).com.br/);
    if (store === null) {
      log.error("Store is undefined");
      throw new Error("Store is undefined");
    }

    await storage.insertData(
      items.price,
      items.title,
      store[0].toString(),
      url
    );
    log.info({
      price: items.price,
      title: items.title,
      store: store[0].toString(),
      url: url
    });
  } catch (e) {
    log.error(e);
  }
}

const filterByStore = async (url: string) => {
  if (!url) {
    log.error("URL is empty");
    throw new Error("URL is empty");
  }
  if (url.includes("www.terabyteshop.com.br")) {
    runScrap(url, () => ScrapTera(url));
  }
  if (url.includes("www.pichau.com.br")) {
    runScrap(url, () => ScrapPichau(url));
  }
  if (url.includes("www.kabum.com.br")) {
    runScrap(url, () => ScrapKabum(url));
  }
}

const runner = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  let list: url[] = await readCSV("./produtos.csv");

  for (const item of list) {
    try {
      await filterByStore(item.url);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      log.error(e);
    }
  }
};

// ... existing code ...

const scheduleRunner = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await runner();
    } catch (e) {
      log.error(e);
    }
  });
};

scheduleRunner();