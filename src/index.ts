import ScrapPichau from "./scrapPichau";
import readCSV from "./readCSV";
import storage from "./storage";
import ScrapKabum from "./scrapKabum";
import ScrapTera from "./scrapTerabyte";
import log from "./utils";

type url = {
  url: string;
};


(async () => {
  storage.dropTable();
  storage.createTable();

  let list: url[] = await readCSV("./produtos.csv");

  for (const item of list) {
    // if (item.url && item.url.includes("www.pichau.com.br")) {
    //   try {
    //     let pichauItems = await ScrapPichau(item.url);
    //     storage.insertData(
    //       pichauItems.price || "",
    //       pichauItems.title || "",
    //       "Pichau"
    //     );
    //     log.debug(pichauItems);
    //   } catch (e) {
    //     log.error(e);

    //   }
    // }
    // if (item.url && item.url.includes("www.kabum.com.br")) {
    //   try {
    //     let kabumItems = await ScrapKabum(item.url);
    //     storage.insertData(
    //       kabumItems.price || "",
    //       kabumItems.title || "",
    //       "Kabum"
    //     );
    //     log.debug(kabumItems);
    //   } catch (e) {
    //     log.error(e);
    //   }
    // }
    if (item.url && item.url.includes("www.terabyteshop.com.br")) {
      try {
        let teraItems = await ScrapTera(item.url);

        if (teraItems.price === undefined) {
          log.error("Price is undefined");
          throw new Error("Price is undefined");
        }
        if (teraItems.title === undefined) {
          log.error("Title is undefined");
          throw new Error("Title is undefined");
        }

        storage.insertData(
          teraItems.price,
          teraItems.title,
          "Terabyte"
        );
        log.debug(teraItems);
      } catch (e) {
        log.error(e);
      }
    }
  }
})();
