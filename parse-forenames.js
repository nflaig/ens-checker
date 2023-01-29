const fs = require("fs");

const raw = fs.readFileSync("./forenames-raw.txt", "utf-8");

const parsed = raw.split("\n").map((url) => url);

// console.log(parsed);

const cleaned = parsed
  .map((c) => c.split("\t")[1])
  .filter((v) => v != null)
  .map((v) => v.toLowerCase());

// console.log(cleaned);

fs.writeFileSync("./forenames.txt", JSON.stringify(cleaned));
