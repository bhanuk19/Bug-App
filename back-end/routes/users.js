import express from "express";
import { urlencoded, json } from "body-parser";
import { filter, propEq } from "ramda";
import { config } from "dotenv";
import * as R from "ramda";
config();
import * as axios from "axios";
import uuidv4 from "uuid";
import Reported from "../Models/reported";
// import User from "../Models/user";
import Fixes from "../Models/fixes";

import * as bodyParser from "body-parser";

import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./uploads/");
  },
  filename: (req, file, callBack) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    callBack(null, req.cookies.username + "-" + uuidv4() + "-" + fileName);
  },
});
let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
// app.use(upload());
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

app.use(urlencoded({ extended: true }));
app.use(json());

app.post("/reportBug", upload.array("images"), (req, res) => {
  if (req.body.bugName === undefined) {
    res.status(204).send("Succeess");
  } else {
    const bugImages = [];
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      bugImages.push(url + "/uploads/" + req.files[i].filename);
    }
    let newReport = new Reported({ ...req.body, bugImages: bugImages });
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
    // console.log(data);
    res.send(data);
  });
});

app.get(["/userBugs/:username", "/userBugs"], (req, res) => {
  // console.log(req.params.username);
  if (!req.params.username) {
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
  } else {
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
  }
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
