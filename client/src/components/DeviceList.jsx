import React, { Component } from "react";
import axios from "axios";

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
		const server = this.props.server;

		if (server) {
			this.getDevices(server);
		}
	}

	componentWillReceiveProps(props) {
		const url = props.server + "/devices";

		this.getDevices(url);
	}

	/**
	 * Ajax request for devices of current user
	 */
	getDevices(url) {
		const self = this;
		const config = {
			crossdomain: true
		};

		axios
			.get(url, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return;
				}

				// TODO: For demo purposes
				res.data.devices.push({
					id: 1,
					name: "Backup"
				});

				self.setState({
					devices: res.data.devices
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		const server = this.props.server;
		const click = this.props.onClick;
		const deviceList = this.state.devices.map(device => (
			<Device
				id={device.id}
				name={device.name}
				onClick={click}
				server={server}
				key={device.id}
			/>
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
