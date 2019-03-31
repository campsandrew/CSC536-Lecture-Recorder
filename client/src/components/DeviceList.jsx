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
			devices: [
				// {
				// 	id: 1,
				// 	name: "Test Device"
				// }
			],
			modal: {
				show: false
			}
		};

		this.onAddDeviceClick = this.onAddDeviceClick.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
		this.onModalAddClick = this.onModalAddClick.bind(this);
		this.onDeviceClick = this.onDeviceClick.bind(this);
		this.apiGetDevicesSuccess = this.apiGetDevicesSuccess.bind(this);
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

	apiAddDeviceSuccess(data) {}

	apiError(err) {
		//TODO:
	}

	onDeviceClick(e, device) {
		this.setState({
			modal: {
				show: true,
				title: device.getName(),
				content: "device",
				primary: "Record",
				secondary: "Close",
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
				secondary: "Close"
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

		this.api.addDevice(modalContent);
	}

	renderDeviceContent() {
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
						server={null}
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
					onPrimary={this.onModalAddClick}
					onSecondary={this.onModalClose}
					action={modal.action}
					content={modal.content}
				/>
			</div>
		);
	}
}

export default DeviceList;
