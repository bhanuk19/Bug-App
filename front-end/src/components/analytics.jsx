import axios from "axios";
import React, { PureComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import Cookies from "universal-cookie";
import { Search, Grid, Header, Segment } from "semantic-ui-react";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Bugs ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function Analytics() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [reportedBugs, setReported] = useState(false);
  const [frequency, setFrequency] = useState(false);
  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [userFrequency, setUserFrequency] = useState(false);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPie2Enter = (_, index) => {
    setActiveIndex2(index);
  };
  const getFrequncy = () => {
    axios
      .get("/reported/all", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data?.auth === false) {
          alert("Unauthorized");
          navigate("/dashboard");
        } else {
          //   console.log(response);
          //   alert("wait");
          setReported(response.data);

          //   setFrequency(frequency);
          getUsers();
        }
      })
      .catch((err) => {
        let cookie = new Cookies();
        cookie.set("session_id", "", { path: "/", expires: new Date() });
        navigate("/bug-hunter/login");
      });
  };
  useEffect(getFrequncy, []);
  useEffect(() => {
    if (reportedBugs) {
      let freq = reportedBugs.reduce((a, c) => {
        a[c.status] = (a[c.status] || 0) + 1;
        return a;
      }, {});
      freq["reported"] = reportedBugs.length;
      let temp = [];
      Object.keys(freq).forEach((ele) => {
        temp.push({ name: ele, value: freq[ele] });
      });
      setFrequency(temp);
    }
  }, [reportedBugs]);
  const getUsers = () => {
    // axios.get("http://localhost:3050/users").then((resp) => {
    axios.get("https://backflipt-accounts.onrender.com/users").then((resp) => {
      setUsers(resp.data);
    });
  };
  const stylesReports = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "30px",
    width: "50%",
  };
  const styles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  };

  const showUserAnalytics = (e) => {
    axios
      .get("/userBugs/" + e.target.value)
      .then((response) => {
        let temp = {
          reported: 0,
          assigned: 0,
          fixed: 0,
        };
        response.data.map((ele) => {
          if (ele["reportedBy"] === e.target.value) {
            temp["reported"] += 1;
          }
          if (ele["fixedBy" && ele["status"] === "Fixed"] === e.target.value) {
            temp["fixed"] += 1;
          }
          if (ele["assignedTo"] === e.target.value) {
            temp["assigned"] += 1;
          }
        });
        let userFreq = [];
        Object.keys(temp).forEach((ele) => {
          userFreq.push({ name: ele, value: temp[ele] });
        });
        setSelectedUser(e.target.value);
        setUserFrequency(userFreq);
      })
      .catch((err) => {
        navigate("/bug-hunter");
      });
  };

  return frequency ? (
    <>
      <div style={styles}>
        <div style={stylesReports}>
          <h1>Report</h1>
          <ResponsiveContainer width={500} height={260}>
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={frequency}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={stylesReports}>
          <h1>Select Reporter</h1>
          <div class="row" style={{ width: "80%" }}>
            <div class="col-md-3">&nbsp;</div>
            <div class="col-md-6">
              <select
                name="select_box"
                class="form-select"
                id="select_box"
                onChange={showUserAnalytics}
              >
                <option value="">Select User</option>
                {users ? (
                  users.map((ele, index) => (
                    <option value={ele.username} key={index}>
                      {ele.username}
                    </option>
                  ))
                ) : (
                  <></>
                )}
              </select>
            </div>
            <div class="col-md-3">&nbsp;</div>
          </div>
        </div>
      </div>
      <div style={styles}>
        {userFrequency ? (
          <div style={stylesReports}>
            <h1>
              Fequency of{" "}
              <span style={{ color: "#8884D8", fontSize: "2rem" }}>
                {selectedUser}
              </span>
            </h1>
            <ResponsiveContainer width={500} height={250}>
              <PieChart width={400} height={400}>
                <Pie
                  activeIndex={activeIndex2}
                  activeShape={renderActiveShape}
                  data={userFrequency}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPie2Enter}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <h1>Loading.....</h1>
  );
}
