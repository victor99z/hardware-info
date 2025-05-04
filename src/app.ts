import readCSV from "./utils/read_csv";
import log from "./config/logger";
import storage from "./utils/storage";
import ScrapPichau from "./scripts/pichau";
import ScrapKabum from "./scripts/kabum";
import ScrapTera from "./scripts/terabyte";
import scrapAmazon from "./scripts/amazon";
import express from 'express';
import productRoutes from './routes/productRoutes';

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
    log.info(`Data inserted successfully for ${url}`);
  } catch (e) {
    log.error(e);
  }
}

const filterByStore = async (url: string) => {
  if (!url) {
    log.error("URL is empty");
    throw new Error("URL is empty");
  }
  // if (url.includes("www.terabyteshop.com.br")) {
  //   runScrap(url, () => ScrapTera(url));
  // }
  if (url.includes("www.pichau.com.br")) {
    runScrap(url, () => ScrapPichau(url));
  }
  // if (url.includes("www.kabum.com.br")) {
  //   runScrap(url, () => ScrapKabum(url));
  // }
  // if (url.includes("www.amazon.com.br")) {
  //   runScrap(url, () => scrapAmazon(url));
  //}

}

const runner = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  let list: url[] = await readCSV("./produtos.csv");

  list.map(async (item) => {
    try {
      await filterByStore(item.url);
    } catch (e) {
      log.error(`Failed to process URL ${item.url}: ${e}`);
    }
  })
};

runner();
