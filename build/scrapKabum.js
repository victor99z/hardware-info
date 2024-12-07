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
const puppeteer_1 = __importDefault(require("puppeteer"));
function ScrapKabum(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let title;
        let price;
        const browser = yield puppeteer_1.default.launch({
            headless: true,
            defaultViewport: null,
            args: ["--start-maximized"],
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
            },
        });
        const page = yield browser.newPage();
        // const url =
        //   "https://www.pichau.com.br/processador-amd-ryzen-7-9800x3d-8-core-16-threads-4-7ghz-5-2ghz-turbo-cache-104mb-100-1000001084wof";
        // const cookiesPath = "./cookies.json";
        try {
            // Set user agent and headers to mimic a real browser
            yield page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36");
            // Navigate to the target page
            yield page.goto(url, { waitUntil: "networkidle2" });
            // Create a promise to wait for 5 seconds
            // await new Promise((resolve) => setTimeout(resolve, 5000)); // 3-second delay
            // Get product title
            yield page
                .waitForSelector("#container-purchase > div > div > h1")
                .then((rawTitle) => __awaiter(this, void 0, void 0, function* () {
                const fullTitle = yield (rawTitle === null || rawTitle === void 0 ? void 0 : rawTitle.evaluate((el) => el.textContent));
                title = fullTitle;
            }));
            // Get the price of the product
            yield page.waitForSelector("h4.finalPrice").then((res) => __awaiter(this, void 0, void 0, function* () {
                let val = yield page.$$eval("h4.finalPrice", (elements) => {
                    return elements.map((e) => e.textContent);
                });
                price = val[0];
            }));
            return { title, price };
        }
        catch (error) {
            console.error("Error scraping the page:", error);
        }
        finally {
            yield browser.close();
        }
        return { title, price };
    });
}
exports.default = ScrapKabum;
