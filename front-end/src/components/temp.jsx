import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
export default function Temp() {
  const [users, setUsers] = useState([{ name: "Bhanu" }]);
  const [deleted, setDeleted] = useState([]);
  const addUser = () => {
    let formData = new FormData(document.querySelector("form"));
    let temp = [...users];
    formData.forEach((user) => {
      temp.push({ name: user });
    });
    setUsers(temp);
  };
  const val = { name: "bhanu", value: "xyz" };
  const deleteUser = (index) => {
    const temp = [...users];
    const temp2 = [...deleted];
    temp2.push(temp.splice(index, 1)[0]);
    setDeleted(temp2);
    setUsers(temp);
  };
  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.key === "z") {
        undo(deleted.length - 1);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, deleted]);
  //   useEffect(() => {}, [deleted]);
  const permanentDelete = (index) => {
    let temp = [...deleted];
    temp.splice(index, 1);
    setDeleted(temp);
  };
  const undo = (index) => {
    if (index >= 0) {
      const temp = [...users];
      const temp2 = [...deleted];
      temp.push(temp2.splice(index, 1)[0]);
      setUsers(temp);
      setDeleted(temp2);
    }
  };

  return (
    <div>
      <h1>users : {users.length}</h1>
      <h1>Deleted : {deleted.length}</h1>
      <div className="users">
        <form>
          <input type="text" name="name" placeholder="add user" />
        </form>
        <button onClick={addUser}>Add</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map((ele, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ele.name}</td>
                    <td>
                      <button onClick={() => deleteUser(index)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Undo</th>
            <th>Permananent Delete</th>
          </tr>
        </thead>
        <tbody>
          {deleted ? (
            deleted.map((ele, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ele.name}</td>
                  <td>
                    <button onClick={() => undo(index)}>Undo</button>
                  </td>
                  <td>
                    <button onClick={() => permanentDelete(index)}>
                      Permanent Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
      <QRCode
        
        value={JSON.stringify(val)}
        bgColor={"#fff"}
        fgColor={"#000"}
        size={100 === "" ? 0 : 100}
        style={{marginLeft:"50px",marginTop:"50px"}}
      />
    </div>
  );
}
