import React, { Component } from "react";
//import axios from "axios";
import "./css/Device.css";

import DeviceStatus from "./DeviceStatus";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 2
		};

		this.onClick = this.onClick.bind(this);
		this.onStatusUpdate = this.onStatusUpdate.bind(this);
	}

	getName() {
		return this.props.name;
	}

	getStatus() {
		return this.state.status;
	}

	// updateStatus(url) {
	// 	const self = this;
	// 	const config = {
	// 		crossdomain: true
	// 	};

	// 	axios
	// 		.get(url, config)
	// 		.then(function(res) {
	// 			let status = 2;
	// 			if (res.status !== 200 || !res.data.success) {
	// 				return self.setState({
	// 					status: status
	// 				});
	// 			}

	// 			if (res.data.status in self.statusMap) {
	// 				status = res.data.status;
	// 			}

	// 			self.setState({
	// 				status: status
	// 			});
	// 		})
	// 		.catch(function(err) {
	// 			self.setState({
	// 				status: 2
	// 			});
	// 		});
	// }

	onStatusUpdate() {}

	onClick(e) {
		const click = this.props.onClick;

		if (e.target.id !== "status") {
			click(e, this);
		}
	}

	render() {
		//const id = this.props.id;
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
