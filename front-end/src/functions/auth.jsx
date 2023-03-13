import Cookies from "universal-cookie";

import axios from "axios";
let cookie = new Cookies();
export const checkAuth = async () => {
  if (cookie.get("session_id")) {
    let res = await axios.post(
      "/auth",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data[0];
  } else {
    // cookie.set("session_id", "", { path: "/", expires: new Date() });
    return false;
  }
};
// dispatcher(setLogins([res.data, sessionStorage.getItem("username")]));
//           navigate("/bug-hunter");

export const logout = async () => {
  let flag = false;
  if (!cookie.get("session_id")) {
    return true;
  }
  await axios
    .post(
      "/logout",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => response.data)
    .then((data) => {
      cookie.set("session_id", "", { path: "/", expires: new Date() });
      flag = data;
    });
  return flag;
};
