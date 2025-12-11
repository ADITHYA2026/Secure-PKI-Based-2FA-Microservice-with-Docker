const { totp } = require("otplib");
const base32 = require("hi-base32");

// Convert hex seed → base32 seed
function hexToBase32(hexSeed) {
    const bytes = Buffer.from(hexSeed, "hex");
    return base32.encode(bytes).replace(/=+$/, ""); // Remove padding
}

// Generate TOTP Code
function generateTotpCode(hexSeed) {
    const base32Seed = hexToBase32(hexSeed);

    totp.options = {
        digits: 6,
        step: 30,
        algorithm: "sha1"
    };

    return totp.generate(base32Seed);
}

// Verify TOTP Code
function verifyTotpCode(hexSeed, code, validWindow = 1) {
    const base32Seed = hexToBase32(hexSeed);

    totp.options = {
        digits: 6,
        step: 30,
        algorithm: "sha1",
        window: validWindow
    };

    return totp.check(code, base32Seed);
}

module.exports = {
    generateTotpCode,
    verifyTotpCode
};