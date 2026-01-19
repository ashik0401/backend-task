const { MongoClient } = require("mongodb");

let client = null;
let db = null;

async function connectDB() {
  if (db) return db; 
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("MongoDB connected");
  return db;
}

async function getDB() {
  if (!db) await connectDB();
  return db;
}

module.exports = { connectDB, getDB };
