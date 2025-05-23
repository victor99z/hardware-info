import log from "./config/logger.js";
import db from "./utils/database.js";
import cron from "node-cron";
import ScrapPichauByPage from "./scripts/pichau_product_page.js";
import ScrapKabumByPage from "./scripts/kabum_product_page.js";
import ScrapTeraByPage from "./scripts/terabyte_product_page.js";
import ScrapAmazonByPage from "./scripts/amazon_product_page.js";
import ScrapPatoloucoByPage from "./scripts/patolouco_product_page.js";
import ScrapGKINFOStoreByPage from "./scripts/gkinfostore_product_page.js";

let data = [
  {
    url: "https://www.gkinfostore.com.br/placa-de-video",
  },
];

// cron.schedule("*/15 * * * *", async () => {});
log.info("Init scraping...");
let allUrls = await db.listAllWholePagesUrls();
await ScrapPichauByPage(data);
await ScrapKabumByPage(data);
await ScrapTeraByPage(data);
await ScrapAmazonByPage(data);
await ScrapPatoloucoByPage(data);
await ScrapGKINFOStoreByPage(data);
