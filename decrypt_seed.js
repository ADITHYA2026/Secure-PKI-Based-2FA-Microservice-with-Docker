const fs = require("fs");
const crypto = require("crypto");

function decryptSeed() {
    
    const privateKey = fs.readFileSync("./Keys/student_private.pem", "utf8");

    const encryptedBase64 = fs.readFileSync("./encrypted_seed.txt", "utf8").trim();

    const encryptedBuffer = Buffer.from(encryptedBase64, "base64");

    const decryptedBuffer = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"    
        },
        encryptedBuffer
    );

    const decryptedHex = decryptedBuffer.toString("hex");


    fs.writeFileSync("seed.txt", decryptedHex);

    console.log("✔ Decryption Successful");
    console.log("Decrypted Seed (hex):", decryptedHex);
}

decryptSeed();
