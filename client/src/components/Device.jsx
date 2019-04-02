import React, { Component } from "react";
import "./css/Device.css";

import DeviceStatus from "./DeviceStatus";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 2
		};

		this.statusUpdate = this.statusUpdate.bind(this);
		this.onStatusClick = this.onStatusClick.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		const id = this.props.deviceId;
		this.props.onStatusClick(id, this.statusUpdate);
	}

	onStatusClick(e) {
		const id = this.props.deviceId;
		this.props.onStatusClick(id, this.statusUpdate, this.statusUpdate);
	}

	statusUpdate(data) {
		if (data.hasOwnProperty("status")) {
			return this.setState({ status: data.status });
		}

		this.setState({ status: 2 });
	}

	onClick(e) {
		const name = this.props.name;
		const id = this.props.deviceId;
		const status = this.state.status;

		if (e.target.id !== "status") {
			this.props.onClick(id, name, status, this.statusUpdate); //TODO: Add id possibly
		}
	}

	render() {
		const name = this.props.name;
		const status = this.state.status;

		return (
			<li className="Device" onClick={this.onClick}>
				{name}
				<DeviceStatus status={status} onClick={this.onStatusClick} />
			</li>
		);
	}
}

export default Device;
