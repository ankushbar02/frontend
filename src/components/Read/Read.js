import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Create from "../Create/Create";
import Draggable from "react-draggable";
import "./Read.css";
import env from "react-dotenv"
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
export default function Read() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const [userName, setuserName] = useState("");
  const [id, setid] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [visible, setvisible] = useState(false);

  async function getData() {
    const _id = { id };
    const response = await fetch(`${env.BACKEND_WEB}`+"/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error);
    }
    if (response.ok) {
      setData(result);

      setError("");
    }
  }

  const handleDelete = async (id) => {
    const response = await fetch(`${env.BACKEND_WEB}`+`/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error);
    }
    if (response.ok) {
      setError("Deleted Successfully");
      setTimeout(() => {
        setError("");
        getData();
      }, 500);
    }
  };

  const getDate = (date) => {
    const update = new Date("" + date);
    const newDate = update.toDateString();
    return newDate;
  };

  useEffect(() => {
    const verifyUser = async () => {
      console.log(cookies.jwt);
      if (!cookies.jwt) {
        navigate("/");
      } else {
        const response = await fetch(`${env.BACKEND_WEB}`, {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();
        if (result.status) {
          setuserName(result.user);
          setid(result.id);
          getData();
        } else {
          removeCookie();
          navigate("/");
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  // console.log(visible);
  useEffect(() => {
    getData();
  }, [visible]);

  const logOut = () => {
    removeCookie("jwt");
    // console.log("outside");
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
                <h1 className="modal-title fs-5" id="staticBackdropLabel"></h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setvisible(!visible);
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
                    setvisible(!visible);
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
            <Draggable >
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
                          to={`/${ele._id}`}
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
            </Draggable>
          ))}
          <button
            onClick={() => {
              setvisible(!visible);
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
