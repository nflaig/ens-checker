const fs = require("fs");
// const crypto = require("crypto");
const namehash = require("eth-ens-namehash");
// var sha3 = require('js-sha3').keccak_256;
const fetch = require("node-fetch");

const domainsRaw = fs.readFileSync("./domains.txt", "utf-8");

const domains = domainsRaw.split("\n").map(url => url);
// const domains = JSON.parse(fs.readFileSync("./top100domains.json", "utf-8")).map(o => o.domain);

async function findUnregisteredEthDomains(domains) {
    const unregistered = [];

    const domainChecks = domains.map(async (domain) => {
        try {
            console.log(`Checking domain: ${domain}`)
            const response = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
                "headers": {
                    "content-type": "application/json"
                },
                "body": `{"operationName":"getResolverFromSubgraph","variables":{"id":"${namehash.hash(domain.split(".")[0] + ".eth")}"},"query":"query getResolverFromSubgraph($id: ID!) {\\n  domain(id: $id) {\\n    id\\n    name\\n    resolver {\\n      coinTypes\\n      texts\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
                "method": "POST"
            });
    
            const result =  await response.json();
    
            if (result.data.domain == null) {
                unregistered.push(domain);
            }
        } catch (error) {
            console.error(error)
        }
    });

    await Promise.all(domainChecks);

    return unregistered;
}

findUnregisteredEthDomains(domains).then(unregistered => unregistered.filter(domain => domain.split(".")[0].length > 2)).then(filtered => console.log(JSON.stringify(filtered)));

// console.log(urls)


// function createHash(value) {
//     return crypto.createHash("sha256").update(value).digest("hex");
// }

// function namehash(domain) {
//     return "0x" + createHash(createHash(domain) + "0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0");
// }


// function namehash(name) {
//     if (!name) {
//         return "00".repeat(32);
//     } else {
//         const [label, remainder] = name.split('.');
//         return "0x" + sha3(namehash(remainder) + sha3(label));
//     }
// }



// console.log(namehashLib.hash("example.eth"))
// console.log(namehash("eth"))
// console.log(namehash.hash("foo.eth"))
