import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

const CONNECTOR_URL = //"";
  "https://0y701umd03.execute-api.us-west-2.amazonaws.com/lambda/ipConnector";

ReactDOM.render(
  <App connector={CONNECTOR_URL} />,
  document.getElementById("root")
);
