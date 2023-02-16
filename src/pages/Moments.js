import React from "react";
import logo from "../assets/logo.gif";
import "../pages/Moments.css";

export default function Moments() {
  return (
    <>
      <div className="moment--container">
        <div className="topnav">
          <img src={logo} alt="logo" height="100vh" />
        </div>
        <div className="moment--heading">
          <h1>My Moments</h1>
        </div>
        <div className="moment--cardcontainer">
          <div className="moment--card">
            <img
              src="https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?cs=srgb&dl=pexels-dan-cristian-p%C4%83dure%C8%9B-1193743.jpg&fm=jpg"
              alt="DSA"
              width="100%"
            />
            <div className="moment--txt">
              <h3>Moment 1</h3>
              <p>Description</p>
            </div>
          </div>
          <div className="moment--card">
            <img
              src="https://images.pexels.com/photos/596710/pexels-photo-596710.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="OOPs"
              width="100%"
            />
            <div className="moment--txt">
              <h3>Moment 2</h3>
              <p>Description</p>
            </div>
          </div>
          <div className="moment--card">
            <img
              src="https://images.pexels.com/photos/7105821/pexels-photo-7105821.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt="WebDev"
              width="100%"
            />
            <div className="moment--txt">
              <h3>Moment 3</h3>
              <p>Descripton</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
