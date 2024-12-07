"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
function readCSV(inputFilePath) {
    return new Promise((resolve, reject) => {
        let results = [];
        fs_1.default.createReadStream(inputFilePath)
            .pipe((0, csv_parser_1.default)())
            .on("data", function (data) {
            try {
                results.push(data);
            }
            catch (err) {
                reject(err);
            }
        })
            .on("end", function () {
            resolve(results);
        })
            .on("error", function (err) {
            reject(err);
        });
    });
}
exports.default = readCSV;
