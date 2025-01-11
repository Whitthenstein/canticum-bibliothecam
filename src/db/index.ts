import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { google } from "googleapis";

import * as schema from "./schema";

const createDatabaseForProduction = () => {
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
    url: process.env.TURSO_DB_CONNECTION_URL!,
    authToken: process.env.TURSO_DB_TOKEN
  });

  return drizzle(turso, { schema });
};

export const db = createDatabaseForProduction();

// Google Drive API
const scopes = ["https://www.googleapis.com/auth/drive"];
const creds = JSON.parse(Buffer.from(process.env.GOOGLE_API_CREDS!, "base64").toString());
export const gAuth = new google.auth.GoogleAuth({ credentials: creds, scopes });
export const gDrive = google.drive({ version: "v3", auth: gAuth });
