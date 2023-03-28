import express, { request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import R from "ramda";
import * as axios from "axios";
import { config } from "dotenv";
import conn from "./connection/mongoose";
import Reported from "./Models/reported";
import cookieParser from "cookie-parser";
//Routes

config();
const app = express();
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads"));

//Check Authentication
app.post("/auth", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      {
        session_id: req.cookies.session_id,
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

//Route for clearing session from Database by sending a request to Accounts Service
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

app.use((req, res, next) => {
  if (req.cookies.session_id) {
    axios
      .post(
        process.env.server + "/checkAuth",
        req.query.apikey
          ? { session_id: req.query.key }
          : { session_id: req.cookies.session_id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        if (resp.data[0]) {
          req.admin = resp.data[1];
          next();
        } else {
          res.status(401).send({
            status: "You are not authorized!",
          });
        }
      });
  } else if (req.query.apikey) {
    apikey.findOne({ key: req.query.apikey }, (err, doc) => {
      if (doc) {
        req.admin = false;
        next();
      }
    });
  } else {
    res.status(403).send("Forbidden");
  }
});
//Health Check api
app.get("/health", async (req, res) => {
  let health = { "bug-hunter": "Healthy" };
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
    data = { status: "down" };
  }
  health["accounts"] = {
    ...data,
  };
  res.send(health);
});
app.post("/nameChecker", (req, res) => {
  Reported.findOne({ bugName: req.body.name }, (err, doc) => {
    if (err) throw err;
    res.status(200).send(doc === null ? false : true);
  });
});

import users from "./routes/users";
app.use(users); //Using User Routes

import admin from "./routes/admin";
import apikey from "./Models/apikey";
app.use(admin); //Using Admin Routes

app.listen(process.env.PORT, (req, res) => {
  console.log("http://localhost:" + process.env.PORT);
});
