const axios = require('axios');
require('dotenv').config();

const WATHQ_API_BASE_URL = process.env.WATHQ_API_BASE_URL || "https://wathq.sa/api";
const WATHQ_API_KEY = process.env.WATHQ_API_KEY;

async function testWathqApi() {
  console.log("Starting Wathq API test...");
  console.log(`WATHQ_API_BASE_URL: ${WATHQ_API_BASE_URL}`);
  console.log(`WATHQ_API_KEY: ${WATHQ_API_KEY ? 'Set' : 'Not Set'}`);

  if (!WATHQ_API_KEY) {
    console.error("WATHQ_API_KEY is not set in .env file. Please set it to proceed.");
    return;
  }

  try {
    // Example: Fetching personal data (replace with actual endpoint and data if needed)
    const path = "/personal-data"; // Placeholder path
    const method = "POST";
    const data = { idNumber: "1234567890" }; // Placeholder data

    console.log(`[Wathq API Test] Requesting: ${path}, Method: ${method}, Data: ${JSON.stringify(data)}`);

    const response = await axios({
      method: method,
      url: `${WATHQ_API_BASE_URL}${path}`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WATHQ_API_KEY}`,
      },
      data: data,
    });

    console.log(`[Wathq API Test] Response Status: ${response.status}`);
    console.log(`[Wathq API Test] Response Data: ${JSON.stringify(response.data, null, 2)}`);

    // You can add more specific checks here for the data structure
    if (response.data && response.data.personalInfo) {
      console.log("Successfully received personal info from Wathq API.");
    } else {
      console.log("Wathq API response received, but personalInfo might be missing or empty.");
    }

  } catch (error) {
    if (error.response) {
      console.error(`[Wathq API Test] Error Response Status: ${error.response.status}`);
      console.error(`[Wathq API Test] Error Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error("[Wathq API Test] No response received from Wathq API.");
    } else {
      console.error("[Wathq API Test] Error setting up request:", error.message);
    }
  }
}

testWathqApi();
