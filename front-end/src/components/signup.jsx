import axios from "axios";
import React from "react";

export default function Signup() {
    
  return (
    <div>
      <form>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          id="uname"
        />
        <input type="number" name="phone" id="phone" />
        <input
          type="email"
          name="email"
          placeholder="Enter EmailID"
          id="email"
        />
        <input type="date" name="dob" id="dob" max="2005-12-31" />
        <input
          type="password"
          name="password"
          id="pass"
          placeholder="Enter Password"
        />
        {/* <input
          type="password"
          name="confirm-password"
          id=""
          placeholder="Re-Enter Password"
        /> */}
      </form>
      <button onClick={handleSignup}>SignUp</button>
    </div>
  );
}

const handleSignup = () => {
  axios.post("/signup", new FormData(document.querySelector("form")), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
