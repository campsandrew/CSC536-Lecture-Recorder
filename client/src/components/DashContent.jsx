import React, { Component } from "react";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

import "./css/ContentArea.css";

class DashContent extends Component {
	/**
	 *
	 */
	constructor(props) {
		super(props);
	}

	onClick(e) {}

	/**
	 *
	 */
	render() {
		const server = this.props.server;

		document.title = "LectureFly | Dash";
		return (
			<div className="ContentArea">
				{/*
				<DeviceList server={server} onClick={this.onClick} />
				<VideoList server={server} onClick={this.onClick} />
				*/}
			</div>
		);
	}
}

export default DashContent;
