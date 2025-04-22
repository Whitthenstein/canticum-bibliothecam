const { createClient } =  require("@libsql/client");
const { drizzle } = require("drizzle-orm/libsql");
const { google } = require("googleapis");
const { loadEnvConfig } = require('@next/env');

const seedData = require("./seedData.js");
 
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const createDatabase = () => {
  if (!process.env.TURSO_DB_CONNECTION_URL) {
    throw new Error("TURSO_DB_CONNECTION_URL is not defined");
  }

  if (!process.env.TURSO_DB_TOKEN) {
    throw new Error("TURSO_DB_TOKEN is not defined");
  }

  if (!process.env.GOOGLE_API_CREDS) {
    throw new Error("GOOGLE_API_CREDS is not defined");
  }

  // Turso Database
  const turso = createClient({
    url: process.env.TURSO_DB_CONNECTION_URL,
    authToken: process.env.TURSO_DB_TOKEN
  });

  return drizzle(turso);
};

const db = createDatabase();

// Google Drive API
const scopes = ["https://www.googleapis.com/auth/drive"];
const creds = JSON.parse(Buffer.from(process.env.GOOGLE_API_CREDS, "base64").toString());
const gAuth = new google.auth.GoogleAuth({ credentials: creds, scopes });
const gDrive = google.drive({ version: "v3", auth: gAuth });

function seed() {
  const { AUTHORS } = seedData;

  db.insert()

  
  console.log();
}

seed();