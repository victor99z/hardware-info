import { PrismaClient } from "@prisma/client";
import log from "../config/logger";

const prisma = new PrismaClient();

// Define a function to insert price and title into the database
async function insertData(price: number, title: string, loja: string, url: string) {
  try {
    await prisma.historyPrice.create({
      data: {
        price_avista: price,
        price_parcelado: price,
        url: url
      },
    });
    log.info("Data inserted successfully");
  } catch (err) {
    log.error("Error inserting data:", err);
  }
}

export default { insertData };
