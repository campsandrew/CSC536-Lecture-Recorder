import React, { Component } from "react";
import "./css/ContentArea.css";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

class ContentArea extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="ContentArea">
				<DeviceList />
				<VideoList />
			</div>
		);
	}
}

export default ContentArea;
