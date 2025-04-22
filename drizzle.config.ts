import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_CONNECTION_URL!,
    authToken: process.env.ENVIRONMENT === "testing" ? undefined : process.env.TURSO_DB_TOKEN
  },
  verbose: true,
  strict: true
});
