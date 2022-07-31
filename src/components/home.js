import React from "react";
import "../App.css";
// import $ from "jquery";
import HorizontalScroll from "react-scroll-horizontal";

function Home() {
  return (
    <>
      <div className="Container">
        <div className="Row">
          <HorizontalScroll style={{ height: "100%", width: "100%" }}>
            <div className="Card"></div>
            <div className="Card"></div>
            <div className="Card"></div>
            <div className="Card"></div>
            <div className="Card"></div>
            <div className="Card"></div>
            <div className="Card"></div>
          </HorizontalScroll>
        </div>
      </div>
    </>
  );
}

export default Home;