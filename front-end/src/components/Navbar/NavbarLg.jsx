import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon, Menu, Segment, Dropdown } from "semantic-ui-react";
import Cookies from "universal-cookie";
export default function NavbarLg({ destroySession, logged }) {
  const cookie = new Cookies();
  const [activeItem, setactiveItem] = useState("");
  const handleItemClick = (e, { name }) => setactiveItem(name);
  return (
    <Segment inverted attached size="mini">
      <Menu inverted secondary>
        {logged ? (
          <>
            <Menu.Item
              name="Dashboard"
              active={activeItem === "Dashboard"}
              onClick={handleItemClick}
              as={NavLink}
              to="dashboard"
              className="home-link"
            />
            {cookie.get("admin") === "true" ? (
              <>
                <Menu.Item
                  name="Fixes"
                  active={activeItem === "Fixes"}
                  onClick={handleItemClick}
                  as={NavLink}
                  to="fixes"
                />
                <Menu.Item
                  name="Reported"
                  active={activeItem === "Reported"}
                  onClick={handleItemClick}
                  as={NavLink}
                  to="reported"
                />
                <Menu.Item
                  name="Analytics"
                  active={activeItem === "Analytics"}
                  onClick={handleItemClick}
                  as={NavLink}
                  to="analytics"
                />
              </>
            ) : (
              <></>
            )}
            <Menu.Item
              name="Assigned"
              active={activeItem === "Assigned"}
              onClick={handleItemClick}
              as={NavLink}
              to="assigned"
            />
            <Menu.Item
              name="Report"
              active={activeItem === "Report"}
              onClick={handleItemClick}
              as={NavLink}
              to="report"
            />

            <Menu.Menu position="right">
              <Dropdown
                text={cookie.get("username")}
                simple
                className="link item"
                direction="right"
              >
                <Dropdown.Menu>
                  <Dropdown.Header>Action Center</Dropdown.Header>
                  <Dropdown.Item as={NavLink} to="profile/bugs">Your Bugs</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Bye....</Dropdown.Header>
                  <Dropdown.Item
                    name="Logout"
                    active={activeItem === "Logout"}
                    onClick={destroySession}
                    position="right"
                    style={{ background: "#BB3F3F" }}
                  >
                    Logout{" "}
                    <Icon name="log out" style={{ marginLeft: "5px" }}></Icon>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </>
        ) : (
          <Menu.Item
            name="Login"
            active={activeItem === "Login"}
            as={NavLink}
            to="authenticate"
            position="right"
          />
        )}
      </Menu>
    </Segment>
  );
}
