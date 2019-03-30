import React, { Component } from "react";
//import axios from "axios";

import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

class DeviceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [
				{
					id: 1,
					name: "Test Device"
				}
			],
			modal: {
				show: false
			}
		};

		this.onAddDeviceClick = this.onAddDeviceClick.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
		this.onModalAddClick = this.onModalAddClick.bind(this);
		this.onDeviceClick = this.onDeviceClick.bind(this);
	}

	/**
	 * Ajax request for devices of current user
	 */
	// loadDevices() {
	// 	const url = this.props.server + "/devices";
	// 	const self = this;
	// 	const config = {
	// 		crossdomain: true
	// 	};

	// 	// Check if there is a server to get devices from
	// 	if (!this.props.server) return;

	// 	axios
	// 		.get(url, config)
	// 		.then(function(res) {
	// 			if (res.status !== 200 || !res.data.success) {
	// 				return;
	// 			}

	// 			// TODO: For demo purposes
	// 			res.data.devices.push({
	// 				id: 1,
	// 				name: "Backup"
	// 			});

	// 			self.setState({
	// 				devices: res.data.devices
	// 			});
	// 		})
	// 		.catch(err => console.log(err));
	// }

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

	onModalAddClick(e) {
		this.setState({
			modal: {
				show: false
			}
		});
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
				>
					<ModalContent content={modal.content} />
				</Modal>
			</div>
		);
	}
}

export default DeviceList;
