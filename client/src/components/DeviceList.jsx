import React from "react";
import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";

function DeviceList(props) {
	const { devices, deviceClick, statusClick, addClick } = props;

	let deviceList;
	if (!devices.length) {
		deviceList = <div className="no-device">no registered devices</div>;
	}

	deviceList = (
		<ul>
			{devices.map(device => (
				<Device
					deviceId={device.id}
					name={device.name}
					onClick={deviceClick}
					onStatusClick={statusClick}
					key={device.id}
				/>
			))}
		</ul>
	);

	return (
		<div className="DeviceList">
			<TitleBar title="Devices">
				<div onClick={addClick} className="add">
					+
				</div>
			</TitleBar>
			{deviceList}
		</div>
	);
}

export default DeviceList;
