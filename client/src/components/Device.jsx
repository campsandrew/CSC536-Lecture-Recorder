import React, { Component } from "react";
import "./css/Device.css";

import DeviceStatus from "./DeviceStatus";
import API from "../api";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 2
		};

		this.onClick = this.onClick.bind(this);
		this.onStatusUpdate = this.onStatusUpdate.bind(this);
		this.apiStatusSuccess = this.apiStatusSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
		this.api = null;
	}

	componentDidMount() {
		if (this.api === null && this.props.server) {
			this.api = new API(this.props.server);
			this.onStatusUpdate();
		}
	}

	getName() {
		return this.props.name;
	}

	getStatus() {
		return this.state.status;
	}

	apiError(err) {
		this.setState({
			status: 2
		});
	}

	apiStatusSuccess(data) {
		this.setState({
			status: data.status
		});
	}

	onStatusUpdate(e) {
		const id = this.props.id;
		this.api.statusDevice(id, this.apiStatusSuccess, this.apiError);
	}

	onClick(e) {
		const click = this.props.onClick;

		if (e.target.id !== "status") {
			this.onStatusUpdate();
			click(e, this);
		}
	}

	render() {
		const name = this.props.name;
		const status = this.state.status;

		return (
			<li className="Device" onClick={this.onClick}>
				{name}
				<DeviceStatus status={status} onClick={this.onStatusUpdate} />
			</li>
		);
	}
}

export default Device;
