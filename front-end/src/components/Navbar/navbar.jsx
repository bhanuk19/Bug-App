import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setLogins, setAdmin } from "../../reducers/globalStates";
import { useNavigate } from "react-router-dom";
import { logout } from "../../functions/auth";
// eslint-disable-next-line no-unused-vars
import { Dropdown, Menu, Segment } from "semantic-ui-react";
import { useMediaQuery } from "react-responsive";
import NavbarMb from "./navbarMB";
import NavbarLg from "./NavbarLg";

export default function Navbar(props) {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const none = useMediaQuery({ query: "(max-width:576px)" });
  const sm = useMediaQuery({ query: "(min-width:576px)" });
  const md = useMediaQuery({ query: "(min-width:768px)" });
  const lg = useMediaQuery({ query: "(min-width:992px)" });
  const xl = useMediaQuery({ query: "(min-width:1200px)" });
  const xxl = useMediaQuery({ query: "(min-width:1400px)" });
  const size = { none, sm, md, lg, xl, xxl };
  const destroySession = async () => {
    let flag = await logout();
    if (flag === true) {
      dispatcher(setLogins(false, null), setAdmin(false));
      navigate("/bug-hunter/authenticate");
    } else {
      return false;
    }
  };
  const State = useSelector((state) => state.globalStates);
  // const [activeItem, setactiveItem] = useState("home");
  // const handleItemClick = (e, { name }) => setactiveItem(name);
  return size.sm ? (
    <NavbarLg destroySession={destroySession} logged={State.loggedIn} />
  ) : (
    <NavbarMb destroySession={destroySession} logged={State.loggedIn} />
  );
}
