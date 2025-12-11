const fs = require("fs");
const axios = require("axios");

async function requestEncryptedSeed() {

  let publicKey = fs.readFileSync("./keys/student_public.pem", "utf8");

   console.log("Public Key Being Sent:\n", publicKey);
  const payload = {
    student_id: "22P31A0540",
    github_repo_url: "https://github.com/ADITHYA2026/Secure-PKI-Based-2FA-Microservice-with-Docker",
    public_key: publicKey
  };

  try {
    const response = await axios.post(
      "https://eajeyq4r3zljoq4rpovy2nthda0vtjqf.lambda-url.ap-south-1.on.aws",
      payload
    );

    console.log("API Response:", response.data);

    fs.writeFileSync("encrypted_seed.txt", response.data.encrypted_seed);

    console.log("encrypted_seed.txt saved!");

  } catch (error) {
    console.error("Failed to get encrypted seed:", error.response ? error.response.data : error.message);
  }
}
requestEncryptedSeed();