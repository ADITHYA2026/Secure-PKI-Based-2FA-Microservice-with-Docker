const fs = require("fs");
const path = require("path");
const { generateTotpCode } = require("../totp");

const SEED_FILE = "/data/seed.txt";
const OUTPUT_FILE = "/cron/last_code.txt";

function run() {
    if (!fs.existsSync(SEED_FILE)) {
        fs.appendFileSync(OUTPUT_FILE, "Seed not found\n");
        return;
    }

    const seed = fs.readFileSync(SEED_FILE, "utf8").trim();
    const code = generateTotpCode(seed);
    const timestamp = new Date().toISOString();

    fs.appendFileSync(OUTPUT_FILE, `${timestamp} ${code}\n`);
}

run();