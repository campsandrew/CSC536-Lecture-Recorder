import React from "react";
import "./css/TitleBar.css";

function TitleBar(props) {
	return <h2 className="TitleBar">{props.title}</h2>;
}

export default TitleBar;
