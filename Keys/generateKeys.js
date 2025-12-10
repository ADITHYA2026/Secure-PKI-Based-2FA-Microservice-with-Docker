const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});
fs.writeFileSync('student_public.pem', publicKey);
fs.writeFileSync('student_private.pem', privateKey);
console.log("RSA Keys generated successfully!");