import React from "react";
import "./css/TitleBar.css";

function TitleBar({ title, className, action }) {
	function getAction() {
		let content = "";

		switch (action) {
			case "add":
				break;
			case "status":
				break;
			default:
		}

		return content;
	}

	return (
		<h2 className={"TitleBar " + className}>
			{title}
			{getAction()}
		</h2>
	);
}

export default TitleBar;
