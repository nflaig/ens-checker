const fs = require("fs");
const namehash = require("eth-ens-namehash");
const fetch = require("node-fetch");

const raw = fs.readFileSync("./forenames.json", "utf-8");

const parsed = JSON.parse(raw);

async function findUnregisteredEthDomains(domains) {
  const unregistered = [];

  const domainChecks = domains.map(async (domain) => {
    try {
      console.log(`Checking domain: ${domain}`);
      const response = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
        headers: {
          "content-type": "application/json",
        },
        body: `{"operationName":"getResolverFromSubgraph","variables":{"id":"${namehash.hash(
          domain.split(".")[0] + ".eth"
        )}"},"query":"query getResolverFromSubgraph($id: ID!) {\\n  domain(id: $id) {\\n    id\\n    name\\n    resolver {\\n      coinTypes\\n      texts\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
        method: "POST",
      });

      const result = await response.json();

      if (result.data.domain == null) {
        unregistered.push(domain);
      }
    } catch (error) {
      console.error(error);
    }
  });

  await Promise.all(domainChecks);

  return unregistered;
}

findUnregisteredEthDomains(parsed)
  .then((unregistered) => unregistered.filter((domain) => domain.split(".")[0].length > 2))
  .then((filtered) => console.log("Unregistered domains: " + JSON.stringify(filtered)));
