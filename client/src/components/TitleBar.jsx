import React from "react";
import "./css/TitleBar.css";

import DeviceStatus from "./DeviceStatus";

function TitleBar({ title, className, children }) {
	//function getActionContent() {

	// 	switch (action.type) {
	// 		case "add":
	// 			return (
	// 				<div onClick={action.onClick} className="add">
	// 					+
	// 				</div>
	// 			);
	// 		case "status":
	// 			return <DeviceStatus status={action.status} onClick={action.onClick} />;
	// 		default:
	// 	}
	// }

	return (
		<h2 className={"TitleBar " + className}>
			{title}
			{children}
		</h2>
	);
}

export default TitleBar;
