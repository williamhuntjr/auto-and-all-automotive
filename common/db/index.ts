import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  if (!client) {
    const local = databaseUrl.includes("@database:") || databaseUrl.includes("@localhost:");
    client = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      ssl: local ? false : "require",
    });
  }

  return client;
}
