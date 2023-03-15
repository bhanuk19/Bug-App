/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as R from "ramda";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import { Modal } from "./modals";
import { useNavigate } from "react-router-dom";
import { Table, Header, Search, Dropdown, Pagination } from "semantic-ui-react";
import Cookies from "universal-cookie";

export default function Admin() {
  const navigate = useNavigate();
  const bugPriorities = ["Low", "Moderate", "Major", "Critical"];
  const tableHead = [
    "Bug Name",
    "Reporter",
    "Description",
    "Priority",
    "Date",
    "Status",
    "Action",
    "Assign To",
  ];
  const [reportedBugs, setReported] = useState(false);
  const [action, setAction] = useState(false);
  const [bugID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const [users, setUsers] = useState(null);
  const [pages, setPages] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const getBugs = () => {
    setVisibility(null);
    axios
      .get("/reported/" + activePage, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          setReported(response.data[0]);
          setPages(Math.ceil(response.data[1] / 10));
          getUsers();
        }
      })
      .catch((err) => {
        let cookie = new Cookies();
        cookie.set("session_id", "", { path: "/", expires: new Date() });
        navigate("/bug-hunter/login");
      });
  };
  const handleAction = (e) => {
    setID(e.target.parentNode.parentNode.id);
    setVisibility(true);
  };
  const getUsers = () => {
    // axios.get("http://localhost:3050/users").then((resp) => {
      axios.get("https://backflipt-accounts.onrender.com/users").then((resp) => {
      setUsers(resp.data);
    });
  };
  //   const setModal = () =>{

  //   }
  //   setInterval(getBugs, 1000);
  // useEffect(getBugs, [activePage]);
  useEffect(() => {
    getBugs();
  }, [action]);
  useEffect(() => {
    if (filter !== "All") {
      setFiltered(R.filter(R.propEq("status", filter), reportedBugs));
    } else {
      setFiltered(reportedBugs);
    }
  }, [bugID, modalVisibility, reportedBugs, filter, users]);
  const sortFunction = () => {
    ascend
      ? setReported(sortDateDesc(reportedBugs))
      : setReported(sortDateAscend(reportedBugs));
    setAscend(!ascend);
  };
  const selectFilter = (e) => {
    setFilter(e.target.id);

    // setFiltered(R.filter(R.propEq("status", filter), reportedBugs));
  };
  const setAssignee = (e) => {
    let update = {};
    update["_id"] = e.target.parentNode.parentNode.id;
    update["username"] = e.target.value;
    axios
      .post("/assignBug", update, {
        headers: { "Content-Type": "application/json" },
      })
      .then((resp) => {
        if (resp.data) {
          alert("Assigned");
          setAction(!action);
        } else alert("Couldn't assign try again");
      })
      .catch((err) => {
        alert("Couldn't assign try again");
      });
  };
  const changePriority = (e) => {
    let temp = {};
    temp["_id"] = e.target.parentNode.parentNode.id;
    temp["priority"] = e.target.value;
    axios
      .post("/updatePriority", temp, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resp) => {
        if (resp) setAction(!action);
      });
  };
  const handleSearch = (e) => {
    let filteredBySearch = reportedBugs.filter((row) => {
      return Object.values(row).some((value) => {
        if (isNaN(value))
          return value.toLowerCase().includes(e.target.value.toLowerCase());
        return false;
      });
    });
    setFiltered(filteredBySearch);
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
                value="All"
                onChange={selectFilter}
                defaultChecked
              />{" "}
              All
            </label>
            <label htmlFor="reported" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="reported"
                value="reported"
                onChange={selectFilter}
              />{" "}
              Reported
            </label>
            <label htmlFor="Approved" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="Approved"
                value="Approved"
                onChange={selectFilter}
              />{" "}
              Approved
            </label>
            <label htmlFor="Rejected" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="Rejected"
                value="Rejected"
                onChange={selectFilter}
              />{" "}
              Rejected
            </label>
            <label htmlFor="Fixed" className="filter-label">
              <input
                type="radio"
                name="filter"
                id="Fixed"
                value="Fixed"
                onChange={selectFilter}
              />{" "}
              Fixed
            </label>
            <div className="search">
              <input
                type="text"
                className="searchTerm"
                id="searchBar"
                placeholder="Search in this page.."
                onChange={handleSearch}
              />
              <i className="fa fa-search searchButton"></i>
            </div>
          </div>
        </div>

        {filtered.length ? (
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
                    <Table.Cell>
                      <select
                        name="priority"
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
                        defaultValue={reported.priority}
                        onChange={changePriority}
                      >
                        {bugPriorities.map((ele, index) => {
                          return (
                            <option
                              value={ele}
                              key={index}
                              style={{ background: "#fff", color: "#000" }}
                            >
                              {ele}
                            </option>
                          );
                        })}
                      </select>
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
                    <Table.Cell>
                      {reported.status === "Fixed" ? (
                        "Fixed By: " +
                        (reported.fixedBy ? reported.fixedBy : "Anonymous User")
                      ) : (
                        <>
                          <select
                            name="assignee"
                            value={
                              reported.assignedTo
                                ? reported.assignedTo
                                : "Not Assigned"
                            }
                            onChange={setAssignee}
                          >
                            <option value="Not Assigned">Not Assigned</option>
                            {users ? (
                              users.map((ele, index) => (
                                <option value={ele.username} key={index}>
                                  {ele.username}
                                </option>
                              ))
                            ) : (
                              <></>
                            )}
                          </select>
                        </>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <div>
            <h1 style={{ fontSize: "25px", color: "#888", margin: "20px 0px" }}>
              Nothing to show.....
            </h1>
          </div>
        )}
        <Pagination
          activePage={activePage + 1}
          style={{ marginBottom: "20px" }}
          onPageChange={(e) => {
            document.getElementById("searchBar").value = "";
            setActivePage(
              (activePage) =>
                (activePage = parseInt(e.target.getAttribute("value")) - 1)
            );
            setFilter(
              document.querySelector('input[name="filter"]:checked').value
            );
            setAction(!action);
            // console.log(activePage);
          }}
          totalPages={pages}
        />
      </div>
      <div className={modalVisibility ? "overlay active" : "overlay"}>
        {bugID == null ? (
          <></>
        ) : (
          <Modal
            visibility={modalVisibility}
            setVisibility={setVisibility}
            setAction={setAction}
            id={bugID}
            bugs={reportedBugs}
            action={action}
          />
        )}
      </div>
    </>
  ) : (
    <h1>Loading......</h1>
  );
}
