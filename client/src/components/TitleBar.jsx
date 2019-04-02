import React from "react";
import "./css/TitleBar.css";

function TitleBar({ title, className, children }) {
	return (
		<h2 className={"TitleBar " + className}>
			{title}
			{children}
		</h2>
	);
}

export default TitleBar;
