import React, { useEffect, useState } from "react";
import { Header, Search, Table } from "semantic-ui-react";
import { ApprovedModal } from "./modals";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import axios from "axios";
import * as R from "ramda";
import { useNavigate } from "react-router-dom";

export default function Assigned() {
  const [assigned, setAssigned] = useState(false);
  const [action, setAction] = useState(false);
  const [bugID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const tableHead = [
    "Bug Name",
    "Reporter",
    "Description",
    "Priority",
    "Date",
    "Status",
    "Action",
  ];
  const navigate = useNavigate();
  const getAssignedBugs = () => {
    setVisibility(null);
    axios
      .get("/assigned", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          setAssigned(response.data);
        }
      });
  };
  useEffect(getAssignedBugs, [action]);
  useEffect(() => {
    if (filter !== "All") {
      setFiltered(R.filter(R.propEq("status", filter), assigned));
    } else {
      setFiltered(assigned);
    }
  }, [bugID, modalVisibility, assigned, filter]);
  const sortFunction = () => {
    ascend
      ? setAssigned(sortDateDesc(assigned))
      : setAssigned(sortDateAscend(assigned));
    setAscend(!ascend);
  };

  const selectFilter = (e) => {
    if (e.target.id === "All") {
      setFiltered(assigned);
    } else {
      setFilter(e.target.id);
    }
  };
  const handleAction = (e) => {
    setID(e.target.parentNode.parentNode.id);
    setVisibility(true);
  };
  return filtered ? (
    <>
      <div className="form-div">
        <div className="head-div">
          <Header size="huge">Reported Bugs</Header>
          <div>
            <h3>Filters: </h3>
            <label htmlFor="All" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="All"
                onChange={selectFilter}
                defaultChecked
              />{" "}
              All
            </label>
            <label htmlFor="Assigned" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="Assigned"
                onChange={selectFilter}
              />{" "}
              Pending
            </label>
            <label htmlFor="Fixed" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="Fixed"
                onChange={selectFilter}
              />{" "}
              Fixed
            </label>
            <Search placeholder="Search..." />
          </div>
        </div>
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
            {filtered.map((reported, index) => {
              return (
                <Table.Row key={reported._id} id={reported._id}>
                  <Table.Cell>{reported.bugName}</Table.Cell>
                  <Table.Cell>
                    {reported.reportedBy ? reported.reportedBy : "Anonymous"}
                  </Table.Cell>
                  <Table.Cell>
                    {reported.bugDescription.substr(0, 15) + "...."}
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
                    {reported.priority}
                  </Table.Cell>
                  <Table.Cell>{reported.createdAt.substr(0, 10)}</Table.Cell>
                  <Table.Cell>{reported.status}</Table.Cell>
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
            bugs={assigned}
            action={action}
          />
        )}
      </div>
    </>
  ) : (
    <h1>Loading......</h1>
  );
}
