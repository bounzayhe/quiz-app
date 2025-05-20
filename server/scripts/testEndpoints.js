import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/api";
let authToken = "";

// Test data
const testLoginData = {
  email: "test@example.com",
  password: "testpassword",
};

const testClientData = {
  name: "Test Client",
  email: "client@test.com",
  company: "Test Company",
};

// Helper function to make API calls
async function makeRequest(
  endpoint,
  method = "GET",
  data = null,
  needsAuth = false
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (needsAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

// Test all endpoints
async function testEndpoints() {
  console.log("Starting endpoint tests...\n");

  // Test 1: Health Check
  console.log("Testing Health Check...");
  const healthCheck = await makeRequest("/health");
  console.log("Health Check:", healthCheck.status === 200 ? "✅" : "❌");

  // Test 2: Login
  console.log("\nTesting Login...");
  const login = await makeRequest("/auth/login", "POST", testLoginData);
  if (login.status === 200 && login.data.token) {
    authToken = login.data.token;
    console.log("Login:", "✅");
  } else {
    console.log("Login:", "❌");
  }

  // Test 3: Get Companies Stats
  console.log("\nTesting Get Companies Stats...");
  const companiesStats = await makeRequest(
    "/companies/stats",
    "GET",
    null,
    true
  );
  console.log(
    "Get Companies Stats:",
    companiesStats.status === 200 ? "✅" : "❌"
  );

  // Test 4: Get Score Trends
  console.log("\nTesting Get Score Trends...");
  const scoreTrends = await makeRequest(
    "/companies/score-trends",
    "GET",
    null,
    true
  );
  console.log("Get Score Trends:", scoreTrends.status === 200 ? "✅" : "❌");

  // Test 5: Register Client
  console.log("\nTesting Register Client...");
  const registerClient = await makeRequest(
    "/companies/register-client",
    "POST",
    testClientData
  );
  console.log("Register Client:", registerClient.status === 201 ? "✅" : "❌");

  // Test 6: Generate Survey
  console.log("\nTesting Generate Survey...");
  const generateSurvey = await makeRequest(
    "/surveys/generate",
    "POST",
    {},
    true
  );
  console.log("Generate Survey:", generateSurvey.status === 200 ? "✅" : "❌");

  // Test 7: Get Clients Responses
  console.log("\nTesting Get Clients Responses...");
  const clientsResponses = await makeRequest(
    "/companies/clients-responses",
    "GET",
    null,
    true
  );
  console.log(
    "Get Clients Responses:",
    clientsResponses.status === 200 ? "✅" : "❌"
  );

  console.log("\nAll tests completed!");
}

// Run the tests
testEndpoints().catch(console.error);
