/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApprovedModal } from "./modals";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import { Table, Header, Pagination } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { clearCookie } from "../functions/auth";
import * as R from "ramda";
import { isArray } from "lodash";
import { NavLink } from "react-router-dom";
export default function Reported(props) {
  //Local States
  const [userBugs, setUserBugs] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const [action, setAction] = useState(false);
  const [bugID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const [pages, setPages] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const tableHead = [
    "TicketID",
    "Bug Name",
    "Reporter",
    "Description",
    "Priority",
    "Date",
    "Status",
    "Fixed By",
    "Action",
  ];
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/userBugs/" + activePage)
      .then((response) => {
        setUserBugs(response.data);
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          setUserBugs(response.data[0]);
          setPages(Math.ceil(response.data[1] / 10));
        }
      })
      .catch((err) => {
        clearCookie();
        navigate("/bug-hunter/authenticate");
      });
  }, [activePage]);
  useEffect(() => {
    if (filter !== "All") {
      setFiltered(R.filter(R.propEq("status", filter), userBugs));
    } else {
      setFiltered(userBugs);
    }
  }, [userBugs, filter, modalVisibility]);

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
  const selectFilter = (e) => {
    setFilter(e.target.id);
  };
  const handleSearch = (e) => {
    let filteredData = userBugs.filter((row) => {
      return Object.values(row).some((value) => {
        if (isNaN(value) || !isArray(value)) {
          return String(value)
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        }
        return false;
      });
    });
    setFiltered(filteredData);
  };
  return (
    <>
      {filtered ? (
        <>
          <div className="form-div">
            <div className="head-div">
              <Header size="huge">Reported By You</Header>
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
                      <Table.Row
                        key={reported._id}
                        className="reported-bug-list-element"
                        id={reported._id}
                      >
                        <Table.Cell>
                          <NavLink
                            to={"/bug-hunter/ticket/" + reported.ticketID}
                          >
                            {reported.ticketID}
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>
                          {reported.bugName.substr(0, 10)}
                          {reported.bugName.length > 10 ? "..." : ""}
                        </Table.Cell>
                        <Table.Cell>
                          {reported.reportedBy
                            ? reported.reportedBy
                            : "Anonymous"}
                        </Table.Cell>
                        <Table.Cell>
                          {reported.bugDescription.substr(0, 15)}
                          {reported.bugDescription.length > 15 ? "..." : ""}
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
                        <Table.Cell>{reported.status}</Table.Cell>
                        <Table.Cell>
                          {reported.fixedBy === ""
                            ? "pending"
                            : reported.fixedBy}
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
            ) : (
              <div>
                <h1
                  style={{
                    fontSize: "25px",
                    color: "#888",
                    margin: "20px 0px",
                  }}
                >
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
        <div className="loading-body">
          <div className="loader" id="loader"></div>
          <span>Loading</span>
        </div>
      )}
    </>
  );
}
