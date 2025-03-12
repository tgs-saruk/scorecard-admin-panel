import React from "react";
import ReactDOM from "react-dom";
// import "../../style/Loader.css";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>,
    document.body
  );
};

export default Loader;
