import db from "./database.js";
import log from "../config/logger.js";

async function normalizeAmazonURL() {
  const records = await db.listAll({
    filter: "url ~ 'www.amazon.com.br'",
    sort: "-created",
    fields: "id, url",
    perPage: 1000,
  });

  console.log("Total records to update:", records.length);

  // https://www.amazon.com.br/NVIDIA-GEFORCE-192BITS-DUAL-FAN-GRAFFITI/dp/B0BHWZ7DXX/ref=sr_1_5?c=ts&dib=eyJ2IjoiMSJ9.OePoKJ9q7dyk4EgcHyoY46XaDQr1HX9v1VV4agThMFY4PGDV0Obpb1b1_q1utZVVO_ONIdi3dm8FOBisx2Dr2Ywy_a3SsHK4hpGv_x1bNx8KpF6XvObXE6hri3ZRzDc13at9PbMiprhETC-Mw4E1lF210KCuXxjCgbtvN0kLDSvARqkx7stegVw4tQwa19AGjyjJJ8b_5Do-crsLODsceGRhftkI3k5rsPgsWTMM_GeCudUJHxHEhDh8UY1j2iPNv0Pqa0TP_pVDWdisUxRj9-We4dMXT1NctyVbiEDQqH4.kor1WMkfFas630ROjaKjdeHo8J73KnZwzfx4Zw2D7Fc&dib_tag=se&keywords=Placas+de+V%C3%ADdeo&qid=1747961672&s=computers&sr=1-5&ts_id=16364811011&ufe=app_do%3Aamzn1.fos.a492fd4a-f54d-4e8d-8c31-35e0a04ce61e
  // remove /ref from url for each record in records
  for (const record of records) {
    const id = record.id;
    const url = record.url;
    const newUrl = url.split("/ref")[0];
    let res = await db.updateRecord({
      id,
      data: { url: newUrl },
    });
    console.log(res);
  }
}

normalizeAmazonURL();
