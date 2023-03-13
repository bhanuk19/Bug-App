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
          setAdmin(cookie.get("role") === "true")
        );
      } else {
        cookie.set("session_id", "", { path: "/", expires: new Date() });
        dispatcher(setLogins([false, null]), setAdmin(false));
        navigate("/bug-hunter/login")
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
