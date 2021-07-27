import neatCsv from "neat-csv";
import { ETF } from "../../types";

export async function ISharesParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 2,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "Weight (%)":
          return "Weight";
        case "ISIN":
          return header;
        case "Name":
          return header;
        default:
          return null;
      }
    },
  });
  const cleanData = data.filter(
    (item) =>
      item.hasOwnProperty("ISIN") && item.ISIN !== "-" && item !== undefined
  );
  return cleanData;
}

export async function AmundiParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 14,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "ISIN code":
          return "ISIN";
        case "Weight in %":
          return "Weight";
        case "Asset Class":
          return null;
        case "Currency":
          return null;
        default:
          return header;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value.slice(0, -1);
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}

export async function InvescoParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 5,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "":
          return null;
        default:
          return header;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value.slice(0, -1);
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}

export async function XtrackersParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 2,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "":
          return null;
        case "Country":
          return null;
        case "Exchange":
          return null;
        case "Type of Security":
          return null;
        case "Rating":
          return null;
        case "Primary Listing":
          return null;
        case "Currency":
          return null;
        case "Industry Classification":
          return null;
        case "Weighting":
          return "Weight";
        default:
          return header;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value.slice(0, -1);
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}

export async function LGParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 16,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "ISIN":
        case "Weight":
          return header;
        case "COMPONENTS":
          return "Name";
        default:
          return null;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value * 100;
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}

export async function LyxorParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    skipLines: 6,
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "ISIN":
          return header;
        case "% weight":
          return "Weight";
        case "Instrument Name":
          return "Name";
        default:
          return null;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value.slice(0, -1);
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}

export async function DekaParser(file: Buffer) {
  const data = await neatCsv<ETF>(file, {
    mapHeaders: ({ header, index }) => {
      switch (header) {
        case "ISIN":
          return header;
        case "Gewichtung":
          return "Weight";
        case "Holding Name":
          return "Name";
        default:
          return null;
      }
    },
    mapValues: ({ header, index, value }) => {
      if (header === "Weight") {
        return value.slice(0, -1);
      }
      return value;
    },
  });
  const cleanData = data.filter(
    (item) => item.ISIN !== "" && item !== undefined
  );
  return cleanData;
}
