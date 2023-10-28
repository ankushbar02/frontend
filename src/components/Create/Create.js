import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import env from "react-dotenv";
import Cookies from "js-cookie";
import "../Read/Read.css";
const defaultStyle = {
  display: "block",
  overflow: "hidden",
  resize: "none",
  width: "100%",
  backgroundColor: "black",
  color: "white",
  borderRadius: "10px",
  padding: "20px",
};
export default function Create(params) {
  const textareaRef = useRef(null);
  const [note, setnote] = useState("");
  const [tittle, setTittle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const jwt = Cookies.get().jwt;
  const data = { tittle, note };

  useEffect(() => {
    if (!jwt) {
      return navigate("/");
    }
  }, [jwt, navigate]);

  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note) {
      setError("Please create a note");
      return;
    }

    if (!tittle || tittle.length === 0) {
     data.tittle="Untitled"
    }

    const response = await fetch(`${env.BACKEND_WEB}/createnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: `${env.BACKEND_WEB}/createnote`,
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error);
    }
    if (response.ok) {
      setTittle("");
      setnote("");
      setError("");
      return navigate("/readnotes");
    }
  };

  return (
    <div className="container  mt-5 d-flex justify-content-center align-items-center flex-column  ">
      <form className="col-lg-8 col-12 create form " onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label text-light">
            Tittle
          </label>
          <input
            type="text "
            className="form-control text-light"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={tittle}
            onChange={(e) => {
              setTittle(e.target.value);
            }}
            style={{ backgroundColor: "black", color: "white" }}
          />
          <div id="emailHelp" className="form-text"></div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="exampleInputPassword1"
            className="form-label text-light"
          >
            Note
          </label>
          <textarea
            ref={textareaRef}
            style={defaultStyle}
            id="exampleInputPassword1"
            value={note}
            onChange={(e) => {
              setnote(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn mb-5   sub">
          Submit
        </button>
      </form>
      <div className="fixed-bottom">
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}
