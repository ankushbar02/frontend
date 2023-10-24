import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Create from "../Create/Create";
import "./Read.css";
import env from "react-dotenv"; // Update the import path for env
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // Update the import for react-cookie

export default function Read() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["jwt"]);

  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  async function getData() {
    try {
      const response = await fetch(`${env.BACKEND_WEB}/`, { // Update the URL and endpoint
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${env.BACKEND_WEB}/${id}`, { // Update the URL and endpoint
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
  }

  const getDate = (date) => {
    const update = new Date(date);
    const newDate = update.toDateString();
    return newDate;
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/");
      } else {
        try {
          const response = await fetch(`${env.BACKEND_WEB}/`, { // Update the URL and endpoint
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("User verification failed");
          }
          const result = await response.json();
          if (result.status) {
            setUserName(result.user);
            getData();
          } else {
            removeCookie("jwt"); 
            var Cookies = document.cookie.split(";");
            for (var i = 0; i < Cookies.length; i++)
              document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();
            navigate("/");
          }
        } catch (error) {
          setError(error.message);
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    getData();
  }, [visible]);
  

  const logOut = () => {
    removeCookie("jwt");
    var Cookies = document.cookie.split(";");
    for (var i = 0; i < Cookies.length; i++)
      document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();
    navigate("/");
  };

  return (
    <div className="">
      {error && <div className="alert alert-danger fixed-bottom">{error}</div>}

      <div className="container px-4 py-5" id="featured-3">
        {/* {visible && <Create />} */}
        <div
          className="modal fade  "
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setVisible(!visible);
                  }}
                />
              </div>
              <div className="modal-body">
                <Create />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setVisible(!visible);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
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
          <button
            onClick={() => {
              setVisible(!visible);
            }}
            type="button"
            className="btn btn-primary bot"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
