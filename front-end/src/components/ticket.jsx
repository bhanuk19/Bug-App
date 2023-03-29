import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Ticket() {
  const [ticket, setTicket] = useState(false);
  const ticketID = useParams().ticketID;
  useEffect(() => {
    axios.get("/ticket/" + ticketID).then((resp) => {
      setTicket(resp.data.ticket);
    });
  }, []);
  return (
    <>
      {ticket ? (
        <div>
          {Object.keys(ticket).map((ele) => {
            return (
              <>
                <span>{ele}</span>
                <br />
              </>
            );
          })}
        </div>
      ) : (
        <div className="loading-body">
          <div className="loader" id="loader"></div>
          <span>Loading</span>
        </div>
      )}
    </>
  );
}
