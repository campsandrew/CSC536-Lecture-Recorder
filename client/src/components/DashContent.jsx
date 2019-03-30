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
		const lecturer = true;
		let deviceList = null;

		// if viewer then dont render devices
		if (lecturer) {
			deviceList = <DeviceList server={server} />;
		}

		document.title = "LectureFly | Dash";
		return (
			<div className="ContentArea">
				{deviceList}
				<VideoList server={server} isLecturer={lecturer} />
			</div>
		);
	}
}

export default DashContent;
