import React, { useEffect } from "react";
import Navbar from "./Navbar/navbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { checkAuth } from "../functions/auth";
import { setAdmin, setLogins } from "../reducers/globalStates";

export default function Root(props) {
  const dispatcher = useDispatch();
  const cookie = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth().then((res) => {
      if (res) {
        dispatcher(
          setLogins([res, cookie.get("username")]),
          setAdmin(cookie.get("admin") === "true")
        );
      } else {
        Object.keys(cookie.getAll()).map((ele) => {
          cookie.set(ele, "", { path: "/", expires: new Date() });
          return 0;
        });
        dispatcher(setLogins([false, null]), setAdmin(false));
        navigate("/bug-hunter/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
