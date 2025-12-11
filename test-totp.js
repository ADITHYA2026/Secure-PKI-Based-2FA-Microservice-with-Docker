const { generateTotpCode, verifyTotpCode } = require('./totp.js');

console.log("Testing imports...");
console.log("generateTotpCode type:", typeof generateTotpCode);
console.log("verifyTotpCode type:", typeof verifyTotpCode);

// Test with a dummy hex seed
const testSeed = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";
try {
    const code = generateTotpCode(testSeed);
    console.log("Generated code:", code);
    console.log("Code length:", code.length);
    
    const isValid = verifyTotpCode(testSeed, code, 1);
    console.log("Verification result:", isValid);
} catch (err) {
    console.error("Error:", err.message);
}