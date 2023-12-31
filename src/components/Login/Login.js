import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import env from "react-dotenv";
import "../../App.css";
function Login() {
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const jwt = Cookies.get().jwt;
  const today = new Date();

  const nextThreeDays = new Date(
    today.setDate(today.getDate() + 3)
  ).toUTCString();
  const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  useEffect(() => {
    if (jwt) {
      navigate("/readnotes");
    }
  }, [jwt, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userName && !password) {
      setError("Please fill in all required fields.");
      setuserName("");
      setpassword("");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }
    if (!userName) {
      setError("Please enter your email .");
      setuserName("");
      setpassword("");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      setuserName("");
      setpassword("");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }
    if (!emailPattern.test(userName)) {
      setError("Invalid email address");
      setuserName("");
      setpassword("");
      setTimeout(() => {
        setError("");
      }, 1000);
      return;
    }

    const data = { userName, password };
    const response = await fetch(`${env.BACKEND_WEB}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: `${env.CLIENT_WEB}/`,
      },

      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.errors) {
      const { email, password } = result.errors;
      if (email) {
        setError(email);
        setTimeout(() => {
          navigate("/signup");
        }, 2000);
      } else if (password) {
        setError(password);
        setuserName("");
        setpassword("");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
    if (!result.errors) {
      document.cookie =
        "jwt=" +
        result.token +
        ";expires=" +
        nextThreeDays +
        ";SameSite=None;Secure";
      setuserName("");
      setpassword("");
      navigate("/readnotes");
    }
  }

  return (
    <div
      style={{ height: "90vh" }}
      className=" container  d-flex justify-content-center align-items-center"
    >
      <form
        style={{ backgroundColor: "black", color: "white" }}
        onSubmit={handleSubmit}
        className="card p-5  "
      >
        <div className="mb-2 d-flex justify-content-center">
          <h2>Login</h2>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="text"
            placeholder="example@xyz.com"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={userName}
            onChange={(e) => {
              setuserName(e.target.value);
            }}
            style={{ backgroundColor: "black", color: "white" }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            style={{ backgroundColor: "black", color: "white" }}
          />
        </div>
        <p className="text-center">
          Don't have an account <Link to={"/signup"}> Sign up</Link>
        </p>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
