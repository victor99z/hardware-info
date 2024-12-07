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
const scrapPichau_1 = __importDefault(require("./scrapPichau"));
const readCSV_1 = __importDefault(require("./readCSV"));
const storage_1 = __importDefault(require("./storage"));
const scrapKabum_1 = __importDefault(require("./scrapKabum"));
const scrapTerabyte_1 = __importDefault(require("./scrapTerabyte"));
const logger_1 = __importDefault(require("./logger"));
const node_cron_1 = __importDefault(require("node-cron"));
const runScrap = (url, scrapFunction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let items = yield scrapFunction();
        if (items.price === undefined) {
            logger_1.default.error("Price is undefined");
            throw new Error("Price is undefined");
        }
        if (items.title === undefined) {
            logger_1.default.error("Title is undefined");
            throw new Error("Title is undefined");
        }
        // create a regex to get the store from url and store in a variable just the matched part
        let store = url.match(/www.(.*?).com.br/);
        if (store === null) {
            logger_1.default.error("Store is undefined");
            throw new Error("Store is undefined");
        }
        yield storage_1.default.insertData(items.price, items.title, store[0].toString(), url);
        logger_1.default.info({
            price: items.price,
            title: items.title,
            store: store[0].toString(),
            url: url
        });
    }
    catch (e) {
        logger_1.default.error(e);
    }
});
const filterByStore = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url) {
        logger_1.default.error("URL is empty");
        throw new Error("URL is empty");
    }
    if (url.includes("www.terabyteshop.com.br")) {
        runScrap(url, () => (0, scrapTerabyte_1.default)(url));
    }
    if (url.includes("www.pichau.com.br")) {
        runScrap(url, () => (0, scrapPichau_1.default)(url));
    }
    if (url.includes("www.kabum.com.br")) {
        runScrap(url, () => (0, scrapKabum_1.default)(url));
    }
});
const runner = () => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(resolve => setTimeout(resolve, 1000));
    let list = yield (0, readCSV_1.default)("./produtos.csv");
    for (const item of list) {
        try {
            yield filterByStore(item.url);
            yield new Promise(resolve => setTimeout(resolve, 2000));
        }
        catch (e) {
            logger_1.default.error(e);
        }
    }
});
// ... existing code ...
const scheduleRunner = () => {
    node_cron_1.default.schedule("*/5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield runner();
        }
        catch (e) {
            logger_1.default.error(e);
        }
    }));
};
scheduleRunner();
