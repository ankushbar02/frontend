
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import env from "react-dotenv";
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
  const textareaRef = useRef(null);
  const [note, setNote] = useState(""); // Initialize with empty string
  const [tittle, setTittle] = useState(""); // Initialize with empty string
  const [error, setError] = useState("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [note]);

  const { id } = useParams();
  const jwt = Cookies.get("jwt"); // Get JWT from cookies
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    } else {
      const getSingleData = async () => {
        try {
          const response = await fetch(`${env.BACKEND_WEB}/single/${id}`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              
            },
          });
          const result = await response.json();
          if (response.ok) {
            if (result.tittle && result.note) {
              setTittle(result.tittle);
              setNote(result.note);
            } else {
              setError("Data is missing tittle and note.");
            }
          } else {
            setError("Failed to fetch data.");
          }
        } catch (error) {
          setError(error.message);
        }
      };
      getSingleData();
    }
  }, [jwt, navigate, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!tittle || !note) {
      setError("Please fill in all required fields.");
      return;
    }

    const data = { tittle, note };

    const response = await fetch(`${env.BACKEND_WEB}/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
    
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Failed to update the note.");
      return;
    }

    // Clear the form
    setTittle("");
    setNote("");
    setError("");

    // Navigate to the read notes page
    navigate("/readnotes");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      {error && <div className="alert alert-danger fixed-bottom">{error}</div>}
      <form className="col-sm-8 form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            value={tittle}
            onChange={(e) => {
              setTittle(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInput" className="form-label">
            Note
          </label>
          <textarea
            ref={textareaRef}
            style={defaultStyle}
            id="exampleInput"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
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
