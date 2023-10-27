import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./Read.css";
import env from "react-dotenv";
import { useNavigate } from "react-router-dom";

export default function Read() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [text, seTtext] = useState("");
  const [head, setHead] = useState("");
  const jwt = Cookies.get().jwt;

  const today = new Date();
  const nextThreeDays = new Date(
    today.setDate(today.getDate() + 3)
  ).toUTCString();

  const getData = async () => {
    try {
      const response = await fetch(`${env.BACKEND_WEB}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Origin: `${env.CLIENT_WEB}/readnotes`,
          Authorization: "Bearer " + jwt,
        },
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
        headers: {
          "Content-Type": "application/json",
          Origin: `${env.CLIENT_WEB}/readnotes`,
          Authorization: "Bearer " + jwt,
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
            headers: {
              "Content-Type": "application/json",
              Origin: `${env.CLIENT_WEB}/readnotes`,
              Authorization: "Bearer " + jwt,
            },
          });
          if (!response.ok) {
            throw new Error("User verification failed");
          } else {
            const result = await response.json();
            if (result.status) {
              setUserName(result.user);
              getData();
            } else {
              Cookies.remove("jwt");
              navigate("/");
            }
          }
        } catch (error) {
          setError(error.message);
          Cookies.remove("jwt");
          navigate("/");
        }
      }
    };
    verifyUser();
  }, [navigate, jwt, nextThreeDays]);

  const logOut = () => {
    Cookies.remove("jwt");
    navigate("/");
  };
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setHead("");
    seTtext("");
  };

  return (
    <div className="">
      {error && <div className="alert alert-danger fixed-bottom">{error}</div>}

      <div className="container px-4 py-5" id="featured-3">
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

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close btn btn-dark" onClick={closeModal}>
                &times;
              </span>
              <h2>{head}</h2>
              <p>{text}</p>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {data?.map((ele) => (
            <div key={ele._id} className="col  opacity-100 ">
              <div className=" cards p-3 rounded-3 mb-2">
                <div className="card-body">
                  <div className=" d-flex flex-wrap justify-content-between border-bottom border-dark ">
                    <h6 className="pb-2 "> {ele.tittle}</h6>
                    <small className="text-body-secondary sma">
                      Created: {getDate(ele.createdAt)}
                    </small>
                  </div>
                  <p className="card-text note">
                    <code className="fs-5">
                      {ele.note.length < 200
                        ? ele.note
                        : ele.note.slice(0, 200) + "..."}
                    </code>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          openModal();
                          seTtext(ele.note);
                          setHead(ele.tittle);
                        }}
                      >
                        Read
                      </button>
                      <Link
                        className="btn btn-light btn-outline-secondary"
                        to={`/update/${ele._id}`}
                      >
                        <span className="material-symbols-outlined fs-6">
                          edit
                        </span>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger    text-light btn-outline-secondary"
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
          <Link to={"/create"} className="btn shadow-lg  btn-primary bot">
            <span className=" material-symbols-outlined mt-3 ">add</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
