import React from "react";
import axios from "axios";
import * as R from "ramda";
import "../Styles/style.css";
import { useDispatch } from "react-redux";
import { setSelected } from "../reducers/globalStates";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export const Modal = ({
  setAction,
  action,
  setVisibility,
  visibility,
  id,
  bugs,
}) => {
  const cookie = new Cookies();
  const bug = R.find(R.propEq("_id", id), bugs);
  const handleApproval = (e) => {
    let bugID = bug["_id"];
    window.confirm("Are you sure you want to Approve this Bug")
      ? axios
          .post(
            "/updateStatus",
            {
              id: bugID,
              updateStatus: "Approved",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then(() => {
            setAction(!action);
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Okay");
  };

  const handleReject = (e) => {
    let bugID = bug["_id"];
    window.confirm("Are you sure you want to reject")
      ? axios
          .post(
            "/updateStatus",
            {
              id: bugID,
              updateStatus: "Rejected",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then(() => {
            setAction(!action);
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Okay");
  };
  const handleHide = (e) => {
    setVisibility(!visibility);
  };
  return (
    <div className="more-details">
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>
      <span>
        <b>ID: </b>
        {bug["_id"]}
      </span>
      <span>
        <b>Bug: </b>
        {bug.bugName}
        <sub
          className="modal-badge"
          style={
            bug.priority === "Critical"
              ? {
                  background: "#EC0A00",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : bug.priority === "Moderate"
              ? {
                  background: "#066CC3",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : bug.priority === "Major"
              ? {
                  background: "#F6C105",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : {
                  background: "#08B256",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
          }
        >
          {bug.priority}
        </sub>
      </span>
      <span
        style={{
          display: "inline-block",
          width: "100%",
          "word-wrap": "break-word",
        }}
      >
        <b>Description: </b>
        <br />
        {bug.bugDescription}
      </span>
      <span>
        <b>Bug URL: </b>
        <a href={bug.bugURL} target="_blank" rel="noreferrer">
          {bug.bugURL}
        </a>
      </span>
      <span>
        {bug.comments ? (
          bug.comments === "None" ? (
            ""
          ) : (
            <>
              <b>
                Comments:
                <br />
              </b>
              {bug.comments}
            </>
          )
        ) : (
          ""
        )}
      </span>
      <span>
        <b>Reported on: </b>
        {bug.createdAt.substr(0, 10) + " @ " + bug.createdAt.substr(11, 8)}
      </span>
      <span>
        <b>Last Updated on: </b>
        {bug.updatedAt.substr(0, 10) + " @ " + bug.updatedAt.substr(11, 8)}
      </span>
      {bug.status === "Fixed" ? (
        <></>
      ) : (
        <div>
          <button onClick={handleApproval} style={{ background: "#218838" }}>
            Approve
          </button>
          <button onClick={handleReject} style={{ background: "#DC3545" }}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export const FixModal = ({
  setAction,
  action,
  setVisibility,
  visibility,
  id,
  bugs,
}) => {
  const cookie = new Cookies();
  const bug = R.find(R.propEq("_id", id), bugs);
  const navigate = useNavigate();
  const handleApproval = (e) => {
    let fixID = bug["_id"];
    window.confirm("Are you sure you want to Approve this Fix")
      ? axios
          .post(
            "/fixhandle",
            {
              id: fixID,
              bugID: bug.bugID,
              updateStatus: "Fixed",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then(() => {
            setAction(!action);
            navigate("/bug-hunter/dashboard");
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Okay");
  };

  const handleReject = (e) => {
    let fixID = bug["_id"];
    window.confirm("Are you sure you want to reject")
      ? axios
          .post(
            "/fixhandle",
            {
              id: fixID,
              bugID: bug.bugID,
              updateStatus: "Reject",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then(() => {
            setAction(!action);
            navigate("/bug-hunter/dashboard");
          })
          .catch((error) => {
            console.log(error);
          })
      : alert("Okay");
  };
  const handleHide = (e) => {
    setVisibility(!visibility);
  };
  return (
    <div className="more-details">
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>
      <span>
        <b>FixID: </b>
        {bug["_id"]}
      </span>
      <span>
        <b>BugID: </b>
        {bug.bugID}
      </span>
      <span
        style={{
          display: "inline-block",
          width: "100%",
          "word-wrap": "break-word",
        }}
      >
        <b>Description: </b>
        <br />
        {bug.fixDescription}
      </span>
      <span>
        <b>Fix URL: </b>
        <a href={bug.fixURL} target="_blank" rel="noreferrer">
          {bug.fixURL}
        </a>
      </span>
      <span>
        {bug.comments ? (
          bug.comments === "None" ? (
            ""
          ) : (
            <>
              <b>
                Comments:
                <br />
              </b>
              {bug.comments}
            </>
          )
        ) : (
          ""
        )}
      </span>
      <span>
        <b>Reported on: </b>
        {bug.createdAt.substr(0, 10) + " @ " + bug.createdAt.substr(11, 8)}
      </span>
      <span>
        <b>Last Updated on: </b>
        {bug.updatedAt.substr(0, 10) + " @ " + bug.updatedAt.substr(11, 8)}
      </span>

      <div>
        <button onClick={handleApproval} style={{ background: "#218838" }}>
          Approve
        </button>
        <button onClick={handleReject} style={{ background: "#DC3545" }}>
          Reject
        </button>
      </div>
    </div>
  );
};

export const ApprovedModal = ({
  setAction,
  action,
  setVisibility,
  visibility,
  id,
  bugs,
}) => {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const bug = R.find(R.propEq("_id", id), bugs);
  const handleHide = (e) => {
    setVisibility(!visibility);
  };
  const addFix = (e) => {
    dispatcher(setSelected(id));
    navigate("/bug-hunter/fix");
  };
  return (
    <div className="more-details">
      <span className="close-button">
        <i className="fa-regular fa-circle-xmark" onClick={handleHide}></i>
      </span>
      <span>
        <b>ID: </b>
        {bug["_id"]}
      </span>
      <span>
        <b>Bug: </b>
        {bug.bugName}
        <sub
          className="modal-badge"
          style={
            bug.priority === "Critical"
              ? {
                  background: "#EC0A00",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : bug.priority === "Moderate"
              ? {
                  background: "#066CC3",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : bug.priority === "Major"
              ? {
                  background: "#F6C105",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
              : {
                  background: "#08B256",
                  margin: "0",
                  color: "white",
                  fontWeight: "bold",
                }
          }
        >
          {bug.priority}
        </sub>
      </span>
      <span>
        <b>Reported By: </b>
        {bug.repotedBy ? bug.repotedBy : "Anonymous"}
      </span>
      <span
        style={{
          display: "inline-block",
          width: "100%",
          "word-wrap": "break-word",
        }}
      >
        <b>Description: </b>
        <br />
        {bug.bugDescription}
      </span>
      <span>
        <b>Bug URL: </b>
        <a href={bug.bugURL} target="_blank" rel="noreferrer">
          {bug.bugURL}
        </a>
      </span>
      <span>
        {bug.comments ? (
          bug.comments === "None" ? (
            ""
          ) : (
            <>
              <b>
                Comments:
                <br />
              </b>
              {bug.comments}
            </>
          )
        ) : (
          ""
        )}
      </span>
      <span>
        <b>Reported on: </b>
        {bug.createdAt.substr(0, 10) + " @ " + bug.createdAt.substr(11, 8)}
      </span>
      <span>
        <b>Last Updated on: </b>
        {bug.updatedAt.substr(0, 10) + " @ " + bug.updatedAt.substr(11, 8)}
      </span>
      <div>
        <button
          style={{ color: "#fff", background: "#007bff" }}
          onClick={addFix}
        >
          Add Fix
        </button>
      </div>
    </div>
  );
};
