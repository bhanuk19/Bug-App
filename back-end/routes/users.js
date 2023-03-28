import express from "express";
import * as bodyParser from "body-parser";
import multer from "multer";
import { config } from "dotenv";
import * as R from "ramda";
config();
import * as axios from "axios";
import uuidv4 from "uuid";
//Mongoose Models
import Reported from "../Models/reported";
import Fixes from "../Models/fixes";
//
import { sortDateDesc } from "../functions/filters";
import Counter from "../Models/counter";

//Multer Functions for Uploading Images from request with unique names
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

app.post("/reportBug", upload.array("images"), (req, res) => {
  if (req.body.bugName === undefined) {
    res.status(204).send("Succeess");
  } else {
    const bugImages = [];
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      bugImages.push(url + "/uploads/" + req.files[i].filename);
    }
    Counter.find({}, async (err, data) => {
      data[0].reportTicket += 1;
      let newReport = new Reported({
        ticketID: "TK_" + data[0].reportTicket,
        ...req.body,
        bugImages: bugImages,
      });
      newReport.save((err, doc) => {
        if (!err) {
          res.status(201).send("Ok");
        } else {
          console.log("Error during record insertion : " + err);
        }
      });
      await Counter.findByIdAndUpdate(data[0]["_id"], data[0], { new: true });
    });
  }
});
app.post("/addFix", (req, res) => {
  if (req.body.fixDescription === undefined) {
    res.status(204).send("Succeess");
  } else {
    Counter.find({}, async (err, data) => {
      data[0].fixTicket += 1;
      let newFix = new Fixes({
        fixID: "FX_" + data[0].fixTicket,
        ...req.body,
        fixAddedBy: req.cookies.username,
      });
      newFix.save((err, doc) => {
        if (!err) {
          res.status(201).send("Ok");
        } else {
          console.log("Error during record insertion : " + err);
        }
      });
      await Counter.findByIdAndUpdate(data[0]["_id"], data[0], { new: true });
    });
  }
});

app.get("/bugs/:page", (req, res) => {
  Reported.find({}, (err, data) => {
    data = sortDateDesc(R.filter(R.propEq("status", "Approved"), data));
    let length = data.length;
    req.params.page.toLowerCase() === "all"
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

app.get(["/userBugs/:page", "/userBugs/:page/:username"], (req, res) => {
  Reported.find(
    {
      $or: [
        {
          reportedBy: req.query.apikey
            ? req.body.username
            : req.params.username
            ? req.params.username
            : req.cookies.username,
        },
        {
          assignedTo: req.query.apikey
            ? req.body.username
            : req.params.username
            ? req.params.username
            : req.cookies.username,
        },
        {
          fixedBy: req.query.apikey
            ? req.body.username
            : req.params.username
            ? req.params.username
            : req.cookies.username,
        },
      ],
    },
    (err, data) => {
      data = sortDateDesc(data);
      let length = data.length;
      req.params.page.toLowerCase() === "All"
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
    }
  );
});

app.get("/assigned/:page", (req, res) => {
  let sid = req.cookies.session_id;
  axios.get(process.env.server + "/userName/" + sid).then((resp) => {
    if (resp.data !== null) {
      Reported.find({ assignedTo: resp.data }, (err, data) => {
        data = sortDateDesc(data);
        let length = data.length;
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
                length,
              ]);
      });
    }
  });
});

export default app;
