import React, { Component } from "react";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

import "./css/ContentArea.css";

class DashContent extends Component {
	/**
	 *
	 */
	// constructor(props) {
	// 	super(props);
	// }

	/**
	 *
	 */
	render() {
		const server = this.props.server;

		document.title = "LectureFly | Dash";
		return (
			<div className="ContentArea">
				<DeviceList server={server} />
				<VideoList server={server} />
			</div>
		);
	}
}

export default DashContent;
