import ScrapAmazonByPage from "./scripts/catalog_page/amazon_product_page.js";

let data = [
  {
    url: "https://www.gkinfostore.com.br/placa-de-video",
  },
];

await ScrapAmazonByPage(
  [
    {
      url: "https://www.amazon.com.br/Placas-Video/b?ie=UTF8&node=16364811011",
    },
  ],
  false
);
