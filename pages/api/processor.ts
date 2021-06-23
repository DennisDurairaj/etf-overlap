// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import csv from "csv-parser";
import neatCsv from "neat-csv";
import middleware from "./middleware/middleware";
import nextConnect from "next-connect";
import formidable from "formidable";
import Iter from "es-iter";

const handler = nextConnect();

interface ExtendedNextApiRequest extends NextApiRequest {
  files: {
    [key: string]: formidable.File;
  };
  body: {
    [key: string]: string;
  };
}

type ISharesCSV = {
  "Asset Class": string;
  Exchange: string;
  ISIN: string;
  "Issuer Ticker": string;
  Location: string;
  "Market Currency": string;
  "Market Value": string;
  Name: string;
  Nominal: string;
  "Notional Value": string;
  Price: string;
  Sector: string;
  "Weight (%)": string;
};

type ModifiedFiles = {
  [key: string]: formidable.File;
};

function isString(item: string | FileList): item is string {
  if (typeof item === "string") {
    return true;
  }
  return false;
}

handler.use(middleware);

handler.post<ExtendedNextApiRequest, NextApiResponse>(async (req, res) => {
  const filesWithISINOnly: { [key: string]: string[] } = {};
  const filesWithAllProps: {
    [key: string]: ISharesCSV[];
  } = {};
  const files: ModifiedFiles = {};
  const list_pair: Array<string[]> = [];
  const final: { [key: string]: string[] } = {};
  const overlappingETFsWithNames: any = {};
  for (const [key, value] of Object.entries(req.files)) {
    if (value.name) {
      files[value.name.split(".")[0]] = value;
      // const fileNumber = key.split("file").pop();
      // const provider = req.body[`provider${fileNumber}`];
      // result[value.name].provider = provider;
    }
  }
  try {
    for (const [key, value] of Object.entries(files)) {
      if (key.includes("ishares")) {
        const file = fs.readFileSync(value.path);
        const data = await neatCsv<ISharesCSV>(file, {
          skipLines: 2,
        });
        const etfName = key.split("_ishares")[0];
        filesWithAllProps[etfName] = data;
        filesWithISINOnly[etfName] = data
          .map((item) => item.ISIN)
          .filter((item) => item !== "-" && item !== undefined);
      }
      //TODO: Additional ETF providers
      // if (key.includes("amundi")) {
      //   const data = fs
      //     .createReadStream(value.path)
      //     .pipe(csv({ skipLines: 16 }))
      //     .on("data", (data) => filesWithISINOnly[key].push(data))
      //     .on("end", () => {});
      // }
    }
    console.log(filesWithAllProps);

    for (let i = 2; i <= Object.keys(filesWithISINOnly).length; i++) {
      list_pair.push(
        ...new Iter(Object.keys(filesWithISINOnly)).combinations(i)
      );
    }
    console.log(list_pair);
    for (
      let each_combination = 0;
      each_combination < list_pair.length;
      each_combination++
    ) {
      for (
        let each_holding = 0;
        each_holding < filesWithISINOnly[list_pair[each_combination][0]].length;
        each_holding++
      ) {
        let intersection = filesWithISINOnly[
          list_pair[each_combination][0]
        ].filter((x: any) => {
          let isInAll = true;
          for (
            let each_other_etf_in_combi = 1;
            each_other_etf_in_combi < list_pair[each_combination].length;
            each_other_etf_in_combi++
          ) {
            if (
              filesWithISINOnly[
                list_pair[each_combination][each_other_etf_in_combi]
              ].includes(x) === false
            ) {
              isInAll = false;
            }
          }
          return isInAll;
        });
        final[list_pair[each_combination].toString()] = intersection;
      }
    }

    console.log(final);
    const result2: { [key: string]: [{ name: string; overlap: number }?] } = {};

    for (const [combination, listOverlaps] of Object.entries(final)) {
      const etfs = combination.split(",");
      result2[combination] = [];
      listOverlaps.forEach((ISIN) => {
        let name = [];
        let weight = [];
        for (let etf = 0; etf < etfs.length; etf++) {
          const holding = filesWithAllProps[etfs[etf]].find(
            (item: any) => item.ISIN === ISIN
          );
          if (holding) {
            name.push(holding.Name);
            weight.push(parseFloat(holding["Weight (%)"]));
          }
        }
        result2[combination].push({
          name: name[0],
          overlap: Math.min(...weight),
        });
      });
    }
    console.log(result2);

    res.status(200).json(result2);
  } catch (err) {
    // res.status(HttpStatus.BAD_REQUEST).json({ error: err.message });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
