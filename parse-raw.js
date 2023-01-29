const fs = require("fs");

const raw = fs.readFileSync("./countries-raw.txt", "utf-8");

const parsed = raw.split("\n").map((url) => url);

const cleaned = parsed
  .map((c) => c.split("\t")[1])
  .filter((v) => v != null)
  .map((v) => v.split("(")[0].trim().replaceAll(" ", "-").toLowerCase());

fs.writeFileSync("./countries.json", JSON.stringify(cleaned));
