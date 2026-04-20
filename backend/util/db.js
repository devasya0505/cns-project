const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDb() {
  if (db) return db;
  await client.connect();
  db = client.db();
  global.db = db;
  console.log("Connected to database");
  return db;
}

module.exports = { connectDb, client };
