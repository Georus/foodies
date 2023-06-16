import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.account}:${process.env.password}@cluster0.szp0tzo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("test");

export default db;
