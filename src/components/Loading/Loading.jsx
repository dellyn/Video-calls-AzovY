import React from "react";
import "./loading.scss";

const Loading = ({ isLoading }) => {
  return (
    <div className={`loading ${isLoading ? "is-loading" : ""}`}>
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
