import React from "react";
import "./css/Device.css";

import DeviceStatus from "./DeviceStatus";

function Device(props) {
	const { deviceInfo, onDeviceClick, onStatusClick, onRemoveClick } = props;

	const onClick = e => {
		if (e.target.id === "remove") {
			onRemoveClick(deviceInfo);
		} else if (e.target.id === "status") {
			onStatusClick(deviceInfo);
		} else {
			onStatusClick(deviceInfo);
			onDeviceClick(deviceInfo);
		}
	};

	return (
		<li className="Device" onClick={onClick}>
			<div className="device-name">
				<div onClick={onClick} className="remove" id="remove">
					-
				</div>
				{deviceInfo.name}
			</div>
			<DeviceStatus status={deviceInfo.status} onClick={null} />
		</li>
	);
}

export default Device;
