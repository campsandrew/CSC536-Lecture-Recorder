import React from "react";

function DeviceStatus({ status, onClick }) {
	const statusMap = {
		0: "green",
		1: "yellow",
		2: "red"
	};

	return (
		<div
			className="status"
			onClick={onClick}
			style={{ backgroundColor: statusMap[status] }}
			id="status"
		/>
	);
}

export default DeviceStatus;
