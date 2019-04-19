import React from "react";
import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";

function DeviceList(props) {
	const { devices, addClick, deviceClick, statusClick, removeClick } = props;

	let deviceList;
	if (!devices.length) {
		deviceList = <div className="no-device">no registered devices</div>;
	} else {
		deviceList = (
			<ul>
				{devices.map(device => (
					<Device
						deviceInfo={device}
						onDeviceClick={deviceClick}
						onStatusClick={statusClick}
						onRemoveClick={removeClick}
						key={device.id}
					/>
				))}
			</ul>
		);
	}

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
