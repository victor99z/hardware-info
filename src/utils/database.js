import PocketBase from "pocketbase";
import "dotenv/config";

const pb = new PocketBase("https://pocketbase.victorbernardes.me");

const token = process.env.PB_TOKEN;

pb.authStore.save(token, null);

async function createRecord({ id, price_avista, price_parcelado }) {
  try {
    const response = await pb.collection("price_tracker").create({
      price_avista,
      price_parcelado,
      id_product: id,
    });
    return response;
  } catch (error) {
    log.error("Error creating record:", error);
    throw error;
  }
}

async function createPriceRecord({ price, url, title }) {
  try {
    const response = await pb.collection("tracker_gpu").create({
      price,
      url,
      title,
    });
    return response;
  } catch (error) {
    log.error("Error creating record:", error);
    throw error;
  }
}

async function listAllUrlsFromGPU() {
  const records = await pb.collection("url_gpu").getFullList({
    sort: "-created",
    fields: "url",
    perPage: 200,
  });
  return records;
}

async function listAll({ filter, sort, fields, perPage }) {
  const records = await pb
    .collection("tracker_gpu")
    .getFullList({ filter, sort, fields });
  return records;
}

async function updateRecord({ id, data }) {
  try {
    const response = await pb.collection("tracker_gpu").update(id, data);
    return response;
  } catch (error) {
    log.error("Error updating record:", error);
    throw error;
  }
}

export default {
  createRecord,
  createPriceRecord,
  listAllUrlsFromGPU,
  listAll,
  updateRecord,
};
