"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readCSV_1 = __importDefault(require("./readCSV"));
const storage_1 = __importDefault(require("./storage"));
const scrapTerabyte_1 = __importDefault(require("./scrapTerabyte"));
const utils_1 = __importDefault(require("./utils"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    storage_1.default.dropTable();
    storage_1.default.createTable();
    let list = yield (0, readCSV_1.default)("./produtos.csv");
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
                let teraItems = yield (0, scrapTerabyte_1.default)(item.url);
                if (teraItems.price === undefined) {
                    utils_1.default.error("Price is undefined");
                    throw new Error("Price is undefined");
                }
                if (teraItems.title === undefined) {
                    utils_1.default.error("Title is undefined");
                    throw new Error("Title is undefined");
                }
                storage_1.default.insertData(teraItems.price, teraItems.title, "Terabyte");
                utils_1.default.debug(teraItems);
            }
            catch (e) {
                utils_1.default.error(e);
            }
        }
    }
}))();
