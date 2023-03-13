import express from "express";
import { urlencoded, json } from "body-parser";
import { filter, propEq } from "ramda";
import upload from "express-fileupload";
import * as axios from "axios";
//MongoDB and Mongoose Models
import Reported from "../Models/reported";
import { config } from "dotenv";
config();
import User from "../Models/user";
import Fixes from "../Models/fixes";
import cookieParser from "cookie-parser";
//Middleware
const app = express();
app.use(upload());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
//Admin Routes
const checkCookie = (req, res, next) => {
  if (req.cookies.session_id) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
};
app.use(checkCookie);
//Route for updating status of a reported Bug
app.post("/updateStatus", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      { session_id: req.cookies.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data[0] && resp.data[1]) {
        if (req.body.updateStatus === undefined) {
          res.status(204).send("");
        } else {
          Reported.findByIdAndUpdate(
            req.body.id,
            { status: req.body.updateStatus },
            (err, result) => {
              if (!err) {
                res.send("ok");
              }
            }
          );
        }
      } else {
        res.status(401).send({
          status: "You are not authorized to access this API!",
        });
      }
    });
});
//Route for updating status of a fix
app.post("/fixhandle", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      { session_id: req.cookies.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data[0] && resp.data[1]) {
        if (req.body.updateStatus === undefined) {
          res.status(204).send("Success");
        } else {
          Fixes.findByIdAndUpdate(
            req.body.id,
            { status: req.body.updateStatus },
            (err, doc) => {
              Reported.findByIdAndUpdate(
                doc.bugID,
                { status: req.body.updateStatus },
                (err, doc) => {
                  res.status(200).send("Ok");
                }
              );
            }
          );
        }
      } else {
        res.status(401).send({
          status: "You are not authorized to access this API!",
        });
      }
    });
});

//Sending all Reported bugs to authorized user (admin)
app.get("/reported/:page", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      { session_id: req.cookies.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data[0] && resp.data[1]) {
        Reported.find({}, async (err, data) => {
          req.params.page === "All".toLowerCase()
            ? res.send(data)
            : res
                .status(200)
                .send([
                  data.splice(
                    parseInt(req.params.page)
                      ? parseInt(req.params.page) * 10
                      : 0,
                    10
                  ),
                  await Reported.count({}),
                ]);
        });
      } else {
        res.status(401).send({
          status: "You are not authorized to access this API!",
        });
      }
    });
});
//Sending fixes to authorized user (admin)
app.post("/fixes", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      { session_id: req.cookies.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data[0] && resp.data[1]) {
        Fixes.find({}, (err, data) => {
          data = filter(propEq("status", "Pending"), data);
          res.send(data);
        });
      } else {
        res.status(401).send({
          status: "You are not authorized to access this API!",
        });
      }
    });
});
//Updateing Priority of Reported Bug
app.post("/updatePriority", (req, res) => {
  axios
    .post(
      process.env.server + "/checkAuth",
      { session_id: req.cookies.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((resp) => {
      if (resp.data[0] && resp.data[1]) {
        Reported.findByIdAndUpdate(
          req.body["_id"],
          { priority: req.body.priority },
          (err, data) => {
            if (!err) res.status(200).send(true);
          }
        );
      } else {
        res.status(401).send({
          status: "You are not authorized to access this API!",
        });
      }
    });
});

app.post("/assignBug", (req, res) => {
  console.log(req.body);
  Reported.findByIdAndUpdate(
    req.body._id,
    { assignedTo: req.body.username, status: "Assigned" },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});
app.post("/selectBug", (req, res) => {});
export default app;
