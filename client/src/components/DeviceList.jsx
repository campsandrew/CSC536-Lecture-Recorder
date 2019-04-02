import React from "react";
import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";

function DeviceList({ devices, deviceClick, addClick }) {
	// apiAddDeviceSuccess(data) {
	// 	//let devices = this.state.devices;
	// 	// devices.push(data.device);

	// 	// this.setState({
	// 	// 	devices: devices
	// 	// });
	// }

	// onDeviceClick(e, device) {
	// 	this.setState({
	// 		modal: {
	// 			show: true,
	// 			title: device.getName(),
	// 			content: "device",
	// 			primary: "Record",
	// 			secondary: "Close",
	// 			onPrimary: this.onModalRecordClick,
	// 			onSecondary: this.onModalClose,
	// 			action: {
	// 				type: "status",
	// 				status: device.getStatus(),
	// 				onClick: device.onStatusUpdate
	// 			}
	// 		}
	// 	});
	// }

	// onAddDeviceClick(e) {
	// 	this.setState({
	// 		modal: {
	// 			show: true,
	// 			title: "New Device",
	// 			content: "add-device",
	// 			primary: "Add",
	// 			secondary: "Close",
	// 			onPrimary: this.onModalAddClick,
	// 			onSecondary: this.onModalClose
	// 		}
	// 	});
	// }

	// onModalClose(e) {
	// 	this.setState({
	// 		modal: {
	// 			show: false
	// 		}
	// 	});
	// }

	// onModalAddClick(e, modalContent) {
	// 	this.setState({
	// 		modal: {
	// 			show: false
	// 		}
	// 	});

	// 	this.api.addDevice(modalContent, this.apiAddDeviceSuccess, this.apiError);
	// }

	// onModalRecordClick(e, modalContent) {
	// 	console.log("On Record");
	// }

	let deviceList;
	if (!devices.length) {
		deviceList = <div className="no-device">no registered devices</div>;
	}

	deviceList = (
		<ul>
			{devices.map(device => (
				<Device
					id={device.id}
					name={device.name}
					onClick={deviceClick}
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
