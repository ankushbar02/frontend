import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import env from "react-dotenv"
function Login() {
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");

  const [error, setError] = useState("");
  // console.log(userName, password);
  const navigate = useNavigate();
  const [cookies] = useCookies(["jwt"]);

  useEffect(() => {
    
    if (cookies.jwt) {
      navigate("/readnotes");
    }
  }, [cookies, navigate]);

  console.log(cookies.jwt);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = { userName, password };
    const response = await fetch(`${env.BACKEND_WEB}/login`, {
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
      if (email){setError(email)
        setTimeout(() => {
          navigate("/signup");
        }, 2000);} 
      else if (password) setError(password);
    }
    if (!result.errors) {
      setuserName("");
      setpassword("");
      // console.log("logedin");
      navigate("/readnotes");
    }
  }

  // console.log(userName, password);
  return (
    <div style={{height:"90vh"}} className=" container  d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="card p-5 border-0 shadow-lg ">
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
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={userName}
            onChange={(e) => {
              setuserName(e.target.value);
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
              setpassword(e.target.value);
            }}
          />
        </div>
         <p className="text-center">Don't have an account <Link to={"/signup"}> Sign up</Link></p>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
