import { set, connect, connection } from "mongoose";
import { config } from "dotenv";
config();
set("strictQuery", false);

connect(process.env.MONGO_URL + process.env.Database, {
  useNewUrlParser: true,
});
const conn = connection;
conn.on("connected",  () =>{
  console.log("database is connected successfully");
});
conn.on("error", console.error.bind(console, "connection error:"));
export default conn;
