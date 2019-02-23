import React, { Component } from "react";
import "./css/DeviceList.css";

import Device from "./Device";
import TitleBar from "./TitleBar";

class DeviceList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: []
		};
	}

	componentDidMount() {
		this.setState({
			devices: this.getDevices()
		});
	}

	/**
	 * Ajax request for devices of current user
	 */
	getDevices() {
		var devices = [
			{
				id: 0,
				name: "My Device"
			},
			{
				id: 1,
				name: "Backup"
			}
		];

		//TODO: Ajax request
		return devices;
	}

	render() {
		const click = this.props.onClick;
		const deviceList = this.state.devices.map(device => (
			<Device name={device.name} onClick={click} key={device.id} />
		));

		return (
			<div className="DeviceList">
				<TitleBar title="Devices" />
				<ul>{deviceList}</ul>
			</div>
		);
	}
}

export default DeviceList;
