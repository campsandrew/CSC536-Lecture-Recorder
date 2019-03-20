import React from "react";
import "./css/TitleBar.css";

function TitleBar({ title, className }) {
	return <h2 className={"TitleBar " + className}>{title}</h2>;
}

export default TitleBar;
