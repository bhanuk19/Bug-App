import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
export default function Report() {
  const cookie = new Cookies();
  const [nameExist, setBoolExist] = useState(false);
  const [bugName, setBugName] = useState("");
  const [bugURL, setBugURL] = useState("");
  const [bugMessage, setBugMessage] = useState("");
  const [priority, setPriority] = useState("Select Priority");
  const navigate = useNavigate();
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };
  const handleReport = () => {
    if (bugName === "") {
      document.getElementById("err").innerHTML = "Bug Name cannot be empty!";
      return;
    }
    if (!nameExist) {
      return;
    }
    if (bugURL === "") {
      document.getElementById("err").innerHTML = "Bug URL cannot be empty!";
      return;
    }
    if (!isValidUrl(bugURL)) {
      document.getElementById("err").innerHTML = "Enter a Valid URL!";
      return;
    }
    if (bugMessage === "") {
      document.getElementById("err").innerHTML =
        "Bug Description cannot be empty!";
      return;
    }
    if (priority === "Select Priority") {
      document.getElementById("err").innerHTML = "Select Priority";
      return;
    }
    axios
      .post("/reportBug", new FormData(document.querySelector("form")), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          alert("Success");
          navigate("/dashboard");
          // document.querySelector("form").reset()
        } else {
          alert("Failure");
        }
      });
  };
  useEffect(() => {
    if (bugName === "") {
      document.getElementById("takenName").innerHTML = "";
      return;
    }
    axios
      .post(
        "/nameChecker",
        { name: bugName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        let takenSpan = document.getElementById("takenName");
        if (res.data) {
          setBoolExist(false);
          takenSpan.style.color = "#f00";
          takenSpan.innerHTML = "Bug Name already exists";
        } else {
          setBoolExist(true);
          takenSpan.style.color = "#007E34";
          takenSpan.innerHTML = "Good to Go...";
        }
      });
  }, [bugName]);
  return (
    <div className="form-div">
      <h1>Report Bug</h1>
      <form className="report-form">
        <input
          type="text"
          name="bugName"
          placeholder="Bug Name"
          required
          autoFocus
          onChange={(e) => {
            setBugName(e.target.value);
          }}
        />
        <input
          type="text"
          name="reportedBy"
          hidden
          required
          defaultValue={cookie.get("username")}
        />
        <span style={{ color: "#f00" }} id="takenName"></span>
        <input
          type="url"
          name="bugURL"
          placeholder="Bug Link"
          required
          onChange={(e) => {
            setBugURL(e.target.value);
          }}
        />
        <textarea
          name="bugDescription"
          placeholder="Please Describe"
          required
          cols="40"
          rows="5"
          minLength={40}
          onChange={(e) => {
            setBugMessage(e.target.value);
          }}
        ></textarea>
        <textarea name="Comments" placeholder="//Comments"></textarea>
        <label htmlFor="priority">Priority: </label>
        <select
          name="priority"
          id="priority"
          onChange={(e) => {
            setPriority(e.target.value);
          }}
          defaultValue={"Select Priority"}
        >
          <option value="Select Priority">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="Major">Major</option>
          <option value="Critical">Critical</option>
        </select>
      </form>
      <button onClick={handleReport} className="form-button">
        Report Bug
      </button>
      <div>
        <span style={{ color: "#f00" }} id="err"></span>
      </div>
    </div>
  );
}
