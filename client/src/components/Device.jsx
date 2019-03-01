import React, { Component } from "react";
import axios from "axios";
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
		const click = this.props.onClick;
		const name = this.props.name;
		const status = (
			<div id="status" style={{ backgroundColor: this.state.status }} />
		);

		return (
			<li className="Device" onClick={e => click(e, name)}>
				{name}
				{status}
			</li>
		);
	}
}

export default Device;
