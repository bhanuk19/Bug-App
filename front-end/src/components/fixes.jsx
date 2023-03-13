/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FixModal } from "./modals";
import { useNavigate } from "react-router-dom";
import { sortDateAscend, sortDateDesc } from "../functions/filters";
import { Sticky, Table } from "semantic-ui-react";
import axios from "axios";
import Cookies from "universal-cookie";
export default function Fixes() {
  const navigate = useNavigate();
  const tableHead = [
    "FixID",
    "Added By",
    "Description",
    "Status",
    "Date",
    "Action",
  ];
  const [fixes, setFixed] = useState(false);
  const [action, setAction] = useState(false);
  const [fixID, setID] = useState(null);
  const [modalVisibility, setVisibility] = useState(false);
  const getFixes = () => {
    setVisibility(null);
    axios
      .post(
        "/fixes",
        { admin: true },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          setFixed(response.data);
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

  const [ascend, setAscend] = useState(false);
  const sortFunction = () => {
    ascend ? setFixed(sortDateDesc(fixes)) : setFixed(sortDateAscend(fixes));
    setAscend(!ascend);
  };

  useEffect(getFixes, [action]);
  return fixes ? (
    <>
      <div className="form-div">
        <h2>Fixes</h2>
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
                  <Table.Cell>{fix._id}</Table.Cell>
                  <Table.Cell>{fix.fixedBy}</Table.Cell>
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
    <h1>Loading......</h1>
  );
}
