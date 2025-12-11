const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { generateTotpCode, verifyTotpCode } = require("./totp");

const app = express();
app.use(express.json());

const SEED_FILE = "/data/seed.txt";
/*
===========================================================
  ENDPOINT 1: POST /decrypt-seed
===========================================================
*/
app.post("/decrypt-seed", (req, res) => {
    try {
        const { encrypted_seed } = req.body;

        if (!encrypted_seed) {
            return res.status(400).json({ error: "Missing encrypted_seed" });
        }

        const privateKey = fs.readFileSync("/app/Keys/student_private.pem", "utf8");

        const encryptedBuffer = Buffer.from(encrypted_seed, "base64");

        const decryptedBuffer = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256"
            },
            encryptedBuffer
        );

        const hexSeed = decryptedBuffer.toString("utf8").trim();

        if (!/^[0-9a-fA-F]{64}$/.test(hexSeed)) {
            console.error("Invalid decrypted seed:", hexSeed);
            return res.status(500).json({ error: "Decryption failed" });
        }

        fs.writeFileSync(SEED_FILE, hexSeed);

        return res.json({ status: "ok" });

    } catch (err) {
        console.error("❌ ERROR decrypting seed:", err.message);
        return res.status(500).json({ error: "Decryption failed" });
    }
});


/*
===========================================================
  ENDPOINT 2: GET /generate-2fa
===========================================================
*/
app.get("/generate-2fa", (req, res) => {
    try {
        if (!fs.existsSync(SEED_FILE)) {
            return res.status(500).json({ error: "Seed not decrypted yet" });
        }

        const hexSeed = fs.readFileSync(SEED_FILE, "utf8").trim();

        const code = generateTotpCode(hexSeed);

        const now = Math.floor(Date.now() / 1000);
        const remaining = 30 - (now % 30);

        return res.json({
            code,
            valid_for: remaining
        });

    } catch (err) {
        console.error("❌ Error generating 2FA:", err.message);
        return res.status(500).json({ error: "Server error" });
    }
});


/*
===========================================================
  ENDPOINT 3: POST /verify-2fa
===========================================================
*/
app.post("/verify-2fa", (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Missing code" });
        }

        if (!fs.existsSync(SEED_FILE)) {
            return res.status(500).json({ error: "Seed not decrypted yet" });
        }

        const hexSeed = fs.readFileSync(SEED_FILE, "utf8").trim();

        const isValid = verifyTotpCode(hexSeed, code, 1);

        return res.json({ valid: isValid });

    } catch (err) {
        console.error("❌ Error verifying 2FA:", err.message);
        return res.status(500).json({ error: "Server error" });
    }
});


// Default route
app.get("/", (req, res) => {
    res.send("Server is running");
});


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});