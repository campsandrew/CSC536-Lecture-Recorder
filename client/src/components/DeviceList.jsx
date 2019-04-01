import React, { Component } from "react";
import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";
import Modal from "./Modal";
import API from "../api";

class DeviceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			modal: {
				show: false
			}
		};

		this.onAddDeviceClick = this.onAddDeviceClick.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
		this.onModalAddClick = this.onModalAddClick.bind(this);
		this.onDeviceClick = this.onDeviceClick.bind(this);
		this.apiGetDevicesSuccess = this.apiGetDevicesSuccess.bind(this);
		this.apiAddDeviceSuccess = this.apiAddDeviceSuccess.bind(this);
		this.apiStartRecordingSuccess = this.apiStartRecordingSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
		this.api = null;
	}

	componentDidUpdate(prevProps) {
		if (this.api === null && this.props.server) {
			this.api = new API(this.props.server);
			this.api.getDevices(this.apiGetDevicesSuccess, this.apiError);
		}
	}

	apiGetDevicesSuccess(data) {
		this.setState({
			devices: data.devices
		});
	}

	apiAddDeviceSuccess(data) {
		let devices = this.state.devices;
		devices.push(data.device);

		this.setState({
			devices: devices
		});
	}

	apiError(err) {
		//TODO:
	}

	apiStartRecordingSuccess(data) {
		console.log(data);
	}

	onDeviceClick(e, device) {
		this.setState({
			modal: {
				show: true,
				title: device.getName(),
				content: "device",
				primary: "Record",
				secondary: "Close",
				onPrimary: this.onModalRecordClick,
				onSecondary: this.onModalClose,
				action: {
					type: "status",
					status: device.getStatus(),
					onClick: device.onStatusUpdate
				}
			}
		});
	}

	onAddDeviceClick(e) {
		this.setState({
			modal: {
				show: true,
				title: "New Device",
				content: "add-device",
				primary: "Add",
				secondary: "Close",
				onPrimary: this.onModalAddClick,
				onSecondary: this.onModalClose
			}
		});
	}

	onModalClose(e) {
		this.setState({
			modal: {
				show: false
			}
		});
	}

	onModalAddClick(e, modalContent) {
		this.setState({
			modal: {
				show: false
			}
		});

		this.api.addDevice(modalContent, this.apiAddDeviceSuccess, this.apiError);
	}

	onModalRecordClick(e, modalContent) {
		console.log("On Record");
	}

	renderDeviceContent() {
		const server = this.props.server;
		const devices = this.state.devices;

		if (!devices.length) {
			return <div className="no-device">no registered devices</div>;
		}

		return (
			<ul>
				{devices.map(device => (
					<Device
						id={device.id}
						name={device.name}
						onClick={this.onDeviceClick}
						server={server}
						key={device.id}
					/>
				))}
			</ul>
		);
	}

	render() {
		const modal = this.state.modal;

		return (
			<div className="DeviceList">
				<TitleBar
					title="Devices"
					action={{ type: "add", onClick: this.onAddDeviceClick }}
				/>
				{this.renderDeviceContent()}
				<Modal
					show={modal.show}
					title={modal.title}
					primary={modal.primary}
					secondary={modal.secondary}
					onPrimary={modal.onPrimary}
					onSecondary={modal.onSecondary}
					action={modal.action}
					content={modal.content}
				/>
			</div>
		);
	}
}

export default DeviceList;
