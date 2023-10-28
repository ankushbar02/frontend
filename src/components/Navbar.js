import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import img from "../assets/icons8-note-94.png";
export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav
      style={{ backgroundColor: "black",color:"white" }}
      className=" navbar border-bottom nav navbar-expand-lg  "
    >
      <div className="container  d-flex">
        <img
          onClick={() => {
            navigate("/readnotes");
          }}
          width={"60px"}
          src={img}
          alt=""
        />
        <h3
          role="button "
          onClick={() => {
            navigate("/readnotes");
          }}
          className="navbar-brand text-light fs-4 fw-bolder pointer"
        >
          Sticky Notes
        </h3>
      </div>
    </nav>
  );
}
