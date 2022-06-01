import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { userReducer } from "./store/reducer";
import { BrowserRouter as Router } from "react-router-dom";

export const store = createStore(userReducer);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename={"/"}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
