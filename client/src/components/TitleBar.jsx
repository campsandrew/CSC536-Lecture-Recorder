import React from "react";
import "./css/TitleBar.css";

function TitleBar({ title, classes }) {
	return <h2 className={"TitleBar " + classes}>{title}</h2>;
}

export default TitleBar;
