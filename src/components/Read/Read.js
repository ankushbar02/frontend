import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./Read.css";
import env from "react-dotenv"; // Update the import path for env
import { useNavigate } from "react-router-dom";

export default function Read() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const jwt = Cookies.get().jwt;

  const getData = async () => {
    try {
      const response = await fetch(`${env.BACKEND_WEB}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Origin: `${env.CLIENT_WEB}/readnotes`,
         
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${env.BACKEND_WEB}/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Origin: `${env.CLIENT_WEB}/readnotes`,
         
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
      setError("Deleted Successfully");
      setTimeout(() => {
        setError("");
        getData();
      }, 500);
    } catch (error) {
      setError(error.message);
    }
  };

  const getDate = (date) => {
    const update = new Date(date);
    const newDate = update.toDateString();
    return newDate;
  };
  
  useEffect(() => {
    const verifyUser = async () => {
      if (!jwt) {
        navigate("/");
      } else {
        try {
          const response = await fetch(`${env.BACKEND_WEB}/home`, {
            method: "POST",
            credentials: "include", // Include credentials, including cookies
            headers: {
              "Content-Type": "application/json",
              "Origin": env.CLIENT_WEB, // Remove "/readnotes" from the Origin header
           
            },
          });
          if (!response.ok) {
            throw new Error("User verification failed");
          }
          const result = await response.json();
          if (result.status) {
            setUserName(result.user);
            // Set the "jwt" cookie when verification is successful
            Cookies.set("jwt", result.token, {
              expires: 2,
             secure: true,sameSite:"None"
            });
            getData();
          } else {
            // Remove the "jwt" cookie when verification fails
            Cookies.remove("jwt");
          }
        } catch (error) {
          setError(error.message);
        }
      }
    };
    verifyUser();
  }, [navigate, jwt]);
  

  const logOut = () => {
    Cookies.remove("jwt");
    navigate("/");
  };

  return (
    <div className="">
      {error && <div className="alert alert-danger fixed-bottom">{error}</div>}

      <div className="container px-4 py-5" id="featured-3">
        {/* {visible && <Create />} */}

        <div className="d-flex  mb-4 border-bottom justify-content-between">
          <h2 className=" ">Notes</h2>
          <div className="dropdown-center">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {userName}
            </button>
            <ul className="dropdown-menu">
              <li>
                <p
                  className="dropdown-item py-0 mb-0 "
                  role="button"
                  onClick={logOut}
                >
                  Logout
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {data?.map((ele) => (
            <div key={ele._id} className="col  ">
              <div
                style={{ backgroundColor: "#FFD31D" }}
                className="shadow-lg p-3 rounded-3 mb-2"
              >
                <div className="card-body">
                  <div className=" d-flex justify-content-between border-bottom border-dark ">
                    <h4 className="pb-2 "> {ele.tittle}</h4>
                    <small className="text-body-secondary sma">
                      Created: {getDate(ele.createdAt)}
                    </small>
                  </div>

                  <p className="card-text">
                    <code>{ele.note}</code>{" "}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <Link
                        className="btn btn-sm btn-outline-secondary"
                        to={`/update/${ele._id}`}
                      >
                        <span className="material-symbols-outlined fs-6">
                          edit
                        </span>
                      </Link>

                      <button
                        type="button"
                        className="btn btn-sm   text-danger btn-outline-secondary"
                        onClick={() => handleDelete(ele._id)}
                      >
                        <span className="material-symbols-outlined fs-6">
                          delete
                        </span>
                      </button>
                    </div>
                    <small className="text-body-secondary sma">
                      updated: {getDate(ele.updatedAt)}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link to={"/create"} className="btn btn-primary bot">
            <span className="material-symbols-outlined">add</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
