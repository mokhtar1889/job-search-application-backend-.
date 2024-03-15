import express from "express";
import dotenv from "dotenv";
import { bootstrap } from "./bootstrap.js";

dotenv.config();

let app = express();

let port = process.env.PORT;

bootstrap(app);

app.listen(port, () => {
  console.log("server connected successfully");
});
