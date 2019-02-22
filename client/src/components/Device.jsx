import React, { Component } from "react";
import "./css/Device.css";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "yellow"
		};
	}

	componentDidMount() {
		this.setState({
			status: this.getDeviceStatus()
		});
	}

	getDeviceStatus() {
		return "red";
	}

	render() {
		const status = (
			<div id="status" style={{ backgroundColor: this.state.status }} />
		);
		return (
			<li className="Device">
				{this.props.name}
				{status}
			</li>
		);
	}
}

export default Device;
