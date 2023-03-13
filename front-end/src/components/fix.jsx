import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { setSelected } from "../reducers/selectBug";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
export default function Fix(props) {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const selectedBug = useSelector((state) => state.globalStates.value);

  const [fixUrl, setFixUrl] = useState("");
  const [fixDescrtiption, setFixDescription] = useState("");
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };
  const handleFix = (e) => {
    if (fixUrl === "") {
      document.getElementById("err").innerHTML = "URL cannot be Empty!";
      return;
    }
    if (!isValidUrl(fixUrl)) {
      document.getElementById("err").innerHTML = "Please Enter a valid URL";
      return;
    }
    if (fixDescrtiption === "") {
      document.getElementById("err").innerHTML =
        "Description field cannot be Empty!";
      return;
    }

    let newFix = new FormData(document.querySelector("form"));
    newFix.bugID = selectedBug;

    axios
      .post("/addFix", newFix, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Fix Submitted!");
        navigate("/bug-hunter/dashboard");
      });
  };
  useEffect(() => {
    if (selectedBug == null) {
      navigate("/bug-hunter/dashboard");
    }
  });
  return (
    <div className="form-div">
      <h1>Fix Bug</h1>
      <form className="report-form">
        <span>
          <b>BugID: </b>
          {selectedBug}
        </span>
        <input type="text" name="bugID" defaultValue={selectedBug} hidden />
        <input
          type="text"
          name="fixedBy"
          hidden
          required
          defaultValue={cookie.get("username")}
        />
        <input
          type="url"
          name="fixURL"
          placeholder="Fix Link"
          required
          onChange={(e) => {
            setFixUrl(e.target.value);
          }}
        />
        <textarea
          name="fixDescription"
          placeholder="Description"
          required
          cols="40"
          rows="5"
          minLength={40}
          onChange={(e) => {
            setFixDescription(e.target.value);
          }}
        ></textarea>
      </form>

      <button className="form-button" onClick={handleFix}>
        Submit Fix
      </button>
      <div>
        <span style={{ color: "#f00" }} id="err"></span>
      </div>
    </div>
  );
}
