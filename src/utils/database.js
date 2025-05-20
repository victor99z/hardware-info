import PocketBase from "pocketbase";

const pb = new PocketBase("https://pocketbase.victorbernardes.me");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0Nzc3NTYwMCwiaWQiOiIyM2lkNGEybnR6N2Y3NzciLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.g1zzIUyZL46myQa1WFUkXCp8ok8Ct-NvBqQGl4bu7wY";
const path = "https://pocketbase.victorbernardes.me/api";
const url = "/collections/product/records";

const headers = {
  Authorization: "Bearer " + token,
};

pb.authStore.save(token);

// async function listAllProducts() {
//   let params = "?fields=id,url,active?filter=('active'=false)";

//   try {
//     const response = await axios.get(path + url + params, { headers });
//     return response.data;
//   } catch (error) {
//     log.error("Error fetching records:", error);
//     throw error;
//   }
// }

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

async function createProduct(record) {
  try {
    const response = await axios.post(path + url, record, { headers });
    return response.data;
  } catch (error) {
    log.error("Error creating record:", error);
    throw error;
  }
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

export default {
  listAllProducts,
  createProduct,
  createRecord,
};
