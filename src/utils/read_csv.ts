import fs from "fs";
import csv from "csv-parser";

function readCSV(inputFilePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let results: any[] = [];
    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on("data", function (data: any) {
        try {
          results.push(data);
        } catch (err) {
          reject(err);
        }
      })
      .on("end", function () {
        resolve(results);
      })
      .on("error", function (err: any) {
        reject(err);
      });
  });
}

export default readCSV;
