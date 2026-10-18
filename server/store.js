import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_FILE = path.join(root, "data", "responses.json");

let client;

function mongoUri() {
  return process.env.MONGODB_URI || "";
}

async function collection() {
  const uri = mongoUri();
  if (!uri) return null;
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  const dbName = process.env.MONGODB_DB || "bhoomi";
  return client.db(dbName).collection("responses");
}

async function ensureJson() {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, "[]\n", "utf8");
  }
}

async function readJson() {
  await ensureJson();
  try {
    const parsed = JSON.parse(await fs.readFile(DB_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toItem(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { ...rest, id: rest.id || String(_id) };
}

export function usingMongo() {
  return Boolean(mongoUri());
}

export async function readResponses() {
  const col = await collection();
  if (col) {
    const rows = await col.find({}).sort({ createdAt: 1 }).toArray();
    return rows.map(toItem);
  }
  return readJson();
}

export async function addResponse(entry) {
  const next = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  const col = await collection();
  if (col) {
    await col.insertOne(next);
    return next;
  }
  try {
    const rows = await readJson();
    rows.push(next);
    await fs.writeFile(DB_FILE, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
    return next;
  } catch {
    throw new Error("Set MONGODB_URI on Netlify. Local JSON save is only for npm run dev.");
  }
}
