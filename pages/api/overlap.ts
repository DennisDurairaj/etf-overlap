// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import csv from "csv-parser";
import neatCsv from "neat-csv";
import middleware from "./middleware/middleware";
import nextConnect from "next-connect";
import formidable from "formidable";
import Iter from "es-iter";
import _ from "lodash";
import { ETF } from "../types";
import {
  AmundiParser,
  DekaParser,
  InvescoParser,
  ISharesParser,
  LGParser,
  LyxorParser,
  XtrackersParser,
} from "./helpers/ETFParser";

const handler = nextConnect();

interface ExtendedNextApiRequest extends NextApiRequest {
  files: {
    [key: string]: formidable.File;
  };
  body: {
    [key: string]: string;
  };
}

type ModifiedFiles = {
  [key: string]: formidable.File;
};

handler.use(middleware);

handler.post<ExtendedNextApiRequest, NextApiResponse>(async (req, res) => {
  const filesWithAllProps: {
    [key: string]: ETF[];
  } = {};
  const files: ModifiedFiles = {};
  const list_pair: Array<string[]> = [];
  for (const [key, value] of Object.entries(req.files)) {
    if (value.name) {
      files[value.name.split(".")[0]] = value;
    }
  }
  try {
    for (const [key, value] of Object.entries(files)) {
      if (key.includes("ishares")) {
        const file = fs.readFileSync(value.path);
        const data = await ISharesParser(file);
        const etfName = key.split("_ishares")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("amundi")) {
        const file = fs.readFileSync(value.path);
        const data = await AmundiParser(file);
        const etfName = key.split("_amundi")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("invesco")) {
        const file = fs.readFileSync(value.path);
        const data = await InvescoParser(file);
        const etfName = key.split("_invesco")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("xtrackers")) {
        const file = fs.readFileSync(value.path);
        const data = await XtrackersParser(file);
        const etfName = key.split("_xtrackers")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("lg")) {
        const file = fs.readFileSync(value.path);
        const data = await LGParser(file);
        const etfName = key.split("_lg")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("lyxor")) {
        const file = fs.readFileSync(value.path);
        const data = await LyxorParser(file);
        const etfName = key.split("_lyxor")[0];
        filesWithAllProps[etfName] = data;
      }
      if (key.includes("deka")) {
        const file = fs.readFileSync(value.path);
        const data = await DekaParser(file);
        const etfName = key.split("_deka")[0];
        filesWithAllProps[etfName] = data;
      }
    }
    console.log(filesWithAllProps);

    for (let i = 2; i <= Object.keys(filesWithAllProps).length; i++) {
      list_pair.push(
        ...new Iter(Object.keys(filesWithAllProps)).combinations(i)
      );
    }
    console.log(list_pair);

    let intersections: { [key: string]: ETF[] } = {};

    list_pair.forEach((pair) => {
      let listISINs = pair.map((etf) => filesWithAllProps[etf]);
      intersections[pair.toString()] = _.intersectionBy(...listISINs, "ISIN");
    });

    console.log("lodash", intersections);

    res.status(200).json(intersections);
  } catch (err) {}
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
