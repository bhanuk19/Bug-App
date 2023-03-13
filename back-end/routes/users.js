import express from "express";
import { urlencoded, json } from "body-parser";
import { filter, propEq } from "ramda";
import { config } from "dotenv";
config();
import * as axios from "axios";
import upload from "express-fileupload";
import Reported from "../Models/reported";
// import User from "../Models/user";
import Fixes from "../Models/fixes";
const app = express();
import sessions from "express-session";
import cookieParser from "cookie-parser";
app.use(cookieParser());
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());
app.use(upload());

app.use(urlencoded({ extended: true }));
app.use(json());

app.post("/reportBug", (req, res) => {
  if (req.body.bugName === undefined) {
    res.status(204).send("Succeess");
  } else {
    let newReport = new Reported(req.body);
    newReport.save((err, doc) => {
      if (!err) {
        res.status(201).send("Ok");
      } else {
        console.log("Error during record insertion : " + err);
      }
    });
  }
});
app.post("/addFix", (req, res) => {
  if (req.body.fixDescription === undefined) {
    res.status(204).send("Succeess");
  } else {
    let newFix = new Fixes(req.body);
    newFix.save((err, doc) => {
      if (!err) {
        res.status(201).send("Ok");
      } else {
        console.log("Error during record insertion : " + err);
      }
    });
  }
});

app.get("/bugs", (req, res) => {
  Reported.find({}, (err, data) => {
    data = filter(propEq("status", "Approved"), data);
    res.send(data);
  });
});

app.get("/userBugs/:username", (req, res) => {
  // console.log(req.params.username);
  Reported.find(
    {
      $or: [
        { reportedBy: req.params.username },
        { assignedTo: req.params.username },
      ],
    },
    (err, doc) => {
      Fixes.find({ fixedBy: req.params.username }, (err, doc2) => {
        doc2.map((ele) => {
          doc.push(ele);
        });
        if (!err) res.status(200).send(doc);
        else res.send(false);
      });
    }
  );
});

app.get("/assigned", (req, res) => {
  let sid = req.cookies.session_id;
  axios.get(process.env.server + "/userName/" + sid).then((resp) => {
    if (resp.data) {
      Reported.find({ assignedTo: resp.data }, (err, result) => {
        res.send(result);
      });
    }
  });
});

export default app;
