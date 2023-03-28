/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FixModal } from "./modals";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import { Header, Pagination, Table } from "semantic-ui-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isArray } from "lodash";
export default function Fixes() {
  const tableHead = [
    "TicketID",
    "Added By",
    "Description",
    "Status",
    "Date",
    "Action",
  ];
  const [fixes, setFixes] = useState(false);
  const [action, setAction] = useState(false);
  const [ascend, setAscend] = useState(false);
  const [fixID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const [pages, setPages] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/fixes/" + activePage).then((response) => {
      if (response.data?.auth === false) {
        alert("Unauthorized");
        navigate("/dashboard");
      } else {
        setFixes(response.data[0]);
        setPages(Math.ceil(response.data[1] / 10));
        setFiltered(response.data[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {}, [fixes, modalVisibility, filtered]);

  //Show Modal function
  const handleAction = (e) => {
    setID(e.target.parentNode.parentNode.id);
    setVisibility(true);
  };
  //Sort Table based on
  const sortFunction = () => {
    ascend ? setFixes(sortDateDesc(fixes)) : setFixes(sortDateAscend(fixes));
    setAscend(!ascend);
  };
  const handleSearch = (e) => {
    let filteredData = fixes.filter((row) => {
      return Object.values(row).some((value) => {
        if (isNaN(value) || !isArray(value)) {
          return String(value).toLowerCase().includes(e.target.value.toLowerCase());
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
          <Header size="huge">Submitted Fixes</Header>
          <div>
            <div className="search" style={{ marginTop: "0px" }}>
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
              {fixes.map((fix, index) => {
                return (
                  <Table.Row
                    key={fix._id}
                    className="fix-bug-list-element"
                    id={fix._id}
                  >
                    <Table.Cell>{fix.fixID}</Table.Cell>
                    <Table.Cell>{fix.fixAddedBy}</Table.Cell>
                    <Table.Cell>
                      {fix.fixDescription.substr(0, 10) + "...."}
                    </Table.Cell>
                    <Table.Cell>{fix.status}</Table.Cell>
                    <Table.Cell>{fix.createdAt.substr(0, 10)}</Table.Cell>
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
        {fixID == null ? (
          <></>
        ) : (
          <FixModal
            visibility={modalVisibility}
            setVisibility={setVisibility}
            setAction={setAction}
            id={fixID}
            bugs={fixes}
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
