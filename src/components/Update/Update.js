import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import env from "react-dotenv";

import { useCookies } from "react-cookie";
const defaultStyle = {
  display: "block",
  overflow: "hidden",
  resize: "none",
  width: "100%",
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
};
export default function Update() {
  //Manage Input
  const textareaRef = useRef(null);
  const [note, setnote] = useState("");
  const [tittle, setTittle] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    textareaRef.current.style.height = "0px";
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = scrollHeight + "px";
  }, [note]);

  const { id } = useParams();
  const getSingleData = async () => {
    const response = await fetch(`${env.BACKEND_WEB}/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      setTittle(result.tittle);
      setnote(result.note);
    }
  };
  const navigate = useNavigate();
  const [cookies] = useCookies(["jwt"]);
  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getSingleData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { tittle, note };
    // console.log(JSON.stringify(data));
    const response = await fetch(`${env.BACKEND_WEB}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

      navigate("/readnotes");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center  ">
      {error && <div className="alert  alert-success  fixed-bottom">{error}</div>}
      <form className="col-sm-8 form " onSubmit={handleSubmit}>
        {/*  */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Tittle
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={tittle}
            onChange={(e) => {
              setTittle(e.target.value);
            }}
          />
          <div id="emailHelp" className="form-text"></div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
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

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
