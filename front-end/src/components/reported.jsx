import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApprovedModal } from "./modals";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
// import { checkAuth } from "../functions/auth";
// import { useDispatch } from "react-redux";
// import { setAdmin, setLogins } from "../reducers/globalStates";
// import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Table, Header } from "semantic-ui-react";
export default function Reported(props) {
  //Local States
  const cookie = new Cookies();
  // const dispatcher = useDispatch();
  // const navigate = useNavigate();
  const [userBugs, setUserBugs] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [action, setAction] = useState(false);
  const [bugID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const tableHead = [
    "id",
    "Bug Name",
    "Reporter",
    "Description",
    "Priority",
    "Date",
    "Action",
  ];
  useEffect(() => {});
  useEffect(() => {
    let mounted = true;
    axios.get("/userBugs/" + cookie.get("username")).then((response) => {
      if (mounted) {
        setUserBugs(response.data);
        // console.log(response.data);
      }
    });
    return () => (mounted = false);
  }, []);
  useEffect(() => {}, [userBugs]);

  //Show Modal function
  const handleAction = (e) => {
    setID(e.target.parentNode.parentNode.id);
    setVisibility(true);
  };
  //Sort Table based on
  const sortFunction = () => {
    ascend
      ? setUserBugs(sortDateDesc(userBugs))
      : setUserBugs(sortDateAscend(userBugs));
    setAscend(!ascend);
  };
  return (
    <>
      {userBugs ? (
        <>
          <div className="form-div">
            <Header size="huge">Reported By You</Header>
            <Table celled inverted selectable fixed>
              <Table.Header>
                <Table.Row>
                  {tableHead.map((ele, index) =>
                    ele !== "Date" ? (
                      <Table.HeaderCell key={index}>{ele}</Table.HeaderCell>
                    ) : (
                      <Table.HeaderCell
                        key={index}
                        id="datehead"
                        style={{ cursor: "pointer" }}
                        onClick={sortFunction}
                      >
                        {ele}
                        <span id="sorticon" style={{ marginLeft: "10px" }}>
                          <i className="fa-solid fa-sort"></i>
                        </span>
                      </Table.HeaderCell>
                    )
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userBugs.map((reported, index) => {
                  return (
                    <Table.Row
                      key={reported._id}
                      className="reported-bug-list-element"
                      id={reported._id}
                    >
                      <Table.Cell>{reported._id}</Table.Cell>
                      <Table.Cell>{reported.bugName}</Table.Cell>
                      <Table.Cell>
                        {reported.reportedBy
                          ? reported.reportedBy
                          : "Anonymous"}
                      </Table.Cell>
                      <Table.Cell>
                        {reported.bugDescription
                          ? reported.bugDescription.substr(0, 15) + "...."
                          : "NULL"}
                      </Table.Cell>
                      <Table.Cell
                        style={
                          reported.priority === "Critical"
                            ? {
                                background: "#EC0A00",
                                margin: "0",
                                color: "white",
                                fontWeight: "bold",
                              }
                            : reported.priority === "Moderate"
                            ? {
                                background: "#066CC3",
                                margin: "0",
                                color: "white",
                                fontWeight: "bold",
                              }
                            : reported.priority === "Major"
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
                        {reported.priority ? reported.priority : "Low"}
                      </Table.Cell>
                      <Table.Cell>
                        {reported.createdAt.substr(0, 10)}
                      </Table.Cell>

                      <Table.Cell>
                        <button
                          onClick={handleAction}
                          style={{
                            color: "#fff",
                            background: "#007bff",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          View
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </div>
          <div className={modalVisibility ? "overlay active" : "overlay"}>
            {bugID == null ? (
              <></>
            ) : (
              <ApprovedModal
                visibility={modalVisibility}
                setVisibility={setVisibility}
                setAction={setAction}
                id={bugID}
                bugs={userBugs}
                action={action}
              />
            )}
          </div>
        </>
      ) : (
        <h1>Loading......</h1>
      )}
    </>
  );
}
