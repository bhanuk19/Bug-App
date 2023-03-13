import express, { request } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import R from "ramda";
import * as axios from "axios";
import { config } from "dotenv";
import conn from "./connection/mongoose";
import Reported from "./Models/reported";
import upload from "express-fileupload";
config();
const app = express();
app.use(upload());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

//Importing Routes from Users and Admin Modules
app.post("/auth", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      {
        session_id: req.body.session_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(503).send("Server Down");
    });
});
app.post("/nameChecker", (req, res) => {
  Reported.findOne({ bugName: req.body.name }, (err, doc) => {
    if (err) throw err;
    res.status(200).send(doc === null ? false : true);
  });
});
app.get("/health", async (req, res) => {
  let health = {};
  if (conn) {
    health["dbstatus"] = "healthy";
  } else {
    health["dbstatus"] = "Down";
  }
  let data;
  try {
    data = await axios.get(process.env.server + "/health");
    data = data.data;
  } catch (err) {
    data = [false, { dbstatus: "Down" }];
  }
  health["accounts"] = {
    server: data[0] ? "healthy" : "Server Down",
    dbstatus: data[1].dbstatus,
  };
  res.send(health);
});
import users from "./routes/users";
import admin from "./routes/admin";
import { ReturnDocument } from "mongodb";
app.use(admin); //Using Admin Routes
app.use(users); //Using User Routes

app.post("/logout", (req, res) => {
  axios
    .post(
      process.env.server + "/clearSession",
      { session_id: req.body.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) =>
      response.data ? res.send(response.data) : response.send(false)
    );
});

app.listen(process.env.PORT, (req, res) => {
  console.log("https://localhost:" + process.env.PORT);
});
