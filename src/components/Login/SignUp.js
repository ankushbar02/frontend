import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import env from "react-dotenv";

function SignUp() {
  const [userName, setUserName] = useState(""); // Changed setuserName to setUserName
  const [password, setPassword] = useState(""); // Changed setpassword to setPassword
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies(["jwt"]);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  useEffect(() => {
    if (cookies.jwt) {
      navigate("/readnotes");
    }
  }, [cookies.jwt]);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { userName, password };
    const response = await fetch(`${env.BACKEND_WEB}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.errors) {
      const { email, password } = result.errors;
      if (email) {
        setError(email);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (password) setError(password);
    }

    if (!result.errors) {
      document.cookie = `jwt=${result.token}; expires=${expirationDate.toUTCString()}`;
      setUserName(""); // Reset user input fields
      setPassword(""); // Reset user input fields
      navigate("/readnotes");
    }
  }

  return (
    <div
      style={{ height: "90vh" }}
      className="container bod d-flex justify-content-center align-items-center"
    >
      <form onSubmit={handleSubmit} className="card p-5 border-0 shadow-lg">
        <div className="mb-2 d-flex justify-content-center">
          <h2>Sign Up</h2>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <p className="text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUp;
