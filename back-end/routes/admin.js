import express from "express";
import { urlencoded, json } from "body-parser";
import * as axios from "axios";
//MongoDB and Mongoose Models
import * as R from "ramda";
import Reported from "../Models/reported";
import { config } from "dotenv";

config();
import Fixes from "../Models/fixes";
import { sortDateDesc } from "../functions/filters";
//Middleware
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.use((req, res, next) => {
  req.admin ? next() : res.status(401).send({ status: "Unauthorized" });
});

//Route for updating status of a reported Bug
app.post("/updateStatus", (req, res) => {
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
});
//Route for updating status of a fix
app.post("/fixhandle", (req, res) => {
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
});

//Sending all Reported bugs to authorized user (admin)
app.get("/reported/:page", (req, res) => {
  Reported.find({}, (err, data) => {
    data = sortDateDesc(data);
    let length = data.length;
    req.params.page === "All".toLowerCase()
      ? res.send(data)
      : res
          .status(200)
          .send([
            data.splice(
              parseInt(req.params.page) ? parseInt(req.params.page) * 10 : 0,
              10
            ),
            length,
          ]);
  });
});
//Sending fixes to authorized user (admin)
app.get("/fixes/:page", (req, res) => {
  Fixes.find({}, (err, data) => {
    data = R.filter(R.propEq("status", "Pending"), data);
    data = sortDateDesc(data);
    let length = data.length;
    req.params.page.toLowerCase() === "All".toLowerCase()
      ? res.send(data)
      : res
          .status(200)
          .send([
            data.splice(
              parseInt(req.params.page) ? parseInt(req.params.page) * 10 : 0,
              10
            ),
            length,
          ]);
  });
});
//Updateing Priority of Reported Bug
app.post("/updatePriority", (req, res) => {
  Reported.findByIdAndUpdate(
    req.body["_id"],
    { priority: req.body.priority },
    (err, data) => {
      if (!err) res.status(200).send(true);
    }
  );
});
//Assigning a bug to a particular user
app.post("/assignBug", (req, res) => {
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
export default app;
