import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.victorbernardes.me");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0Nzk1NjYwNSwiaWQiOiIyM2lkNGEybnR6N2Y3NzciLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.fkz7D_xuWMiXmFZFhQaQ4KGzrW2lCfu-QVhA5G8e7o4";

pb.authStore.save(token, null);

async function listAllProducts() {
  // you can also fetch all records at once via getFullList
  const records = await pb.collection("product").getFullList({
    sort: "-created",
    fields: "id,url",
    filter: "active=true",
    perPage: 200,
  });
  return records;
}

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
    const response = await pb.collection("price_watch_whole").create({
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

async function listAllWholePagesUrls() {
  const records = await pb.collection("whole_page_url").getFullList({
    sort: "-created",
    fields: "url",
    perPage: 200,
  });
  return records;
}

export default {
  listAllProducts,
  createRecord,
  createPriceRecord,
  listAllWholePagesUrls,
};
