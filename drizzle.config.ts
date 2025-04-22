import { defineConfig } from "drizzle-kit";

const IS_IN_TESTING_ENV = process.env.ENVIRONMENT === "testing";

export default defineConfig({
  schema: IS_IN_TESTING_ENV ? undefined : "./src/db/schema.ts",
  out: IS_IN_TESTING_ENV ? undefined : "./migrations",
  dialect: IS_IN_TESTING_ENV ? "sqlite" : "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_CONNECTION_URL!,
    authToken: IS_IN_TESTING_ENV ? undefined : process.env.TURSO_DB_TOKEN
  },
  verbose: true,
  strict: !IS_IN_TESTING_ENV
});
