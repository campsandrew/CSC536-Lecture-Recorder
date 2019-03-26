import React, { Component } from "react";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

import "./css/ContentArea.css";

class DashContent extends Component {
	/**
	 *
	 */
	constructor(props) {
		super(props);
	}

	onClick(e) {
		if(e.target.id === "status") {
			return;
		}
		
	}

	/**
	 *
	 */
	render() {
		const server = this.props.server;

		document.title = "LectureFly | Dash";
		return (
			<div className="ContentArea">
				<DeviceList server={server} onClick={this.onClick} />
				{/*<VideoList server={server} onClick={this.onClick} />*/}
				{/*
				<Modal>
					<ModalContent />
				</Modal>*/}
			</div>
		);
	}
}

export default DashContent;
