import log from "./config/logger.js";
import ScrapPichau from "./scripts/pichau.js";
import ScrapKabum from "./scripts/kabum.js";
import ScrapTera from "./scripts/terabyte.js";
import scrapAmazon from "./scripts/amazon.js";
import db from "./utils/database.js";
import cron from "node-cron";
import ScrapPichauByPage from "./scripts/pichau_product_page.js";
import ScrapKabumByPage from "./scripts/kabum_product_page.js";
import ScrapTeraByPage from "./scripts/terabyte_product_page.js";
import ScrapAmazonByPage from "./scripts/amazon_product_page.js";
import ScrapPatoloucoByPage from "./scripts/patolouco_product_page.js";
import ScrapGKINFOStoreByPage from "./scripts/gkinfostore_product_page.js";

let allUrls = await db.listAllWholePagesUrls();

console.log(allUrls);

let data = [
  {
    url: "https://www.gkinfostore.com.br/placa-de-video",
  },
];
// await ScrapPichauByPage(data);
//await ScrapKabumByPage(data);
// await ScrapTeraByPage(data);
// await ScrapAmazonByPage(data);
// await ScrapPatoloucoByPage(data);
await ScrapGKINFOStoreByPage(data);
