import React, { useEffect, useState } from "react";
import { Header, Pagination, Table } from "semantic-ui-react";
import { ApprovedModal } from "./modals";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import axios from "axios";
import * as R from "ramda";
import { useNavigate } from "react-router-dom";
import { isArray } from "lodash";

export default function Assigned() {
  const [assigned, setAssigned] = useState(false);
  const [action, setAction] = useState(false);
  const [bugID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
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
    "Action",
  ];
  const navigate = useNavigate();
  const getAssignedBugs = () => {
    setVisibility(null);
    axios
      .get("/assigned/" + activePage, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          setAssigned(response.data[0]);
          setPages(Math.ceil(response.data[1] / 10));
        }
      });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleSearch = (e) => {
    let filteredData = assigned.filter((row) => {
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
  return filtered ? (
    <>
      <div className="form-div">
        <div className="head-div">
          <Header size="huge">Assigned Tickets</Header>
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
                    <Table.Cell>{reported.ticketID}</Table.Cell>
                    <Table.Cell>
                      {reported.bugName.substr(0, 10)}
                      {reported.bugName.length > 10 ? "..." : ""}
                    </Table.Cell>
                    <Table.Cell>
                      {reported.reportedBy ? reported.reportedBy : "Anonymous"}
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
            setAction(!action);
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
            bugs={assigned}
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
  );
}
