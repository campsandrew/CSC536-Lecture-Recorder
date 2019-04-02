import React, { Component } from "react";
import "./css/ContentArea.css";

import AddFormModal from "./AddFormModal";
import DeviceModal from "./DeviceModal";
import DeviceList from "./DeviceList";
import VideoList from "./VideoList";
import API from "../api";

class DashContent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			videos: [],
			devices: []
		};

		this.api = null;
		this.addDeviceClick = this.addDeviceClick.bind(this);
		this.addDeviceClick = this.addDeviceClick.bind(this);
		this.addLecturerClick = this.addLecturerClick.bind(this);
		this.deviceStatusClick = this.deviceStatusClick.bind(this);
		this.deviceClick = this.deviceClick.bind(this);
		this.videoClick = this.videoClick.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.apiSuccess = this.apiSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
	}

	componentDidUpdate(prevProps) {
		const lecturer = this.props.lecturer;
		const server = this.props.server;

		// Create api and get video content
		if (this.api === null && server && lecturer !== undefined) {
			this.api = new API(server);
			this.api.getVideos(
				data => this.setState({ videos: data.videos }),
				this.apiError
			);

			if (lecturer) {
				this.api.getDevices(
					data => this.setState({ devices: data.devices }),
					this.apiError
				);
			}
		}
	}

	onFormSubmit(content, id) {
		const modal = this.state.modal;

		if (this.api === null) {
			this.refs[modal].submitError("no connection to servers");
			return;
		}

		switch (modal) {
			case "add-device":
				this.api.addDevice(content, this.apiSuccess, this.apiError);
				break;
			case "add-lecturer":
				this.api.addLecturer(content, this.apiSuccess, this.apiError);
				break;
			case "device":
				this.api.addVideo(id, content, this.apiSuccess, this.apiError);
				//this.api.recordDevice(id, this.apiSuccess, this.apiError);
				break;
			case "video":
			default:
		}
	}

	apiSuccess(data) {
		const modal = this.state.modal;

		switch (modal) {
			case "add-device":
				let devices = this.state.devices;

				devices.push(data.device);
				this.setState({ devices: devices, show: false });
				break;
			case "add-lecturer":
				break;
			case "device":
			case "video":
			default:
		}
	}

	apiError(error) {
		const modal = this.state.modal;
		const show = this.state.show;

		if (show) {
			this.refs[modal].submitError(error);
		}
	}

	addDeviceClick() {
		this.setState({ show: true, modal: "add-device" });
	}

	addLecturerClick() {}

	deviceClick(id, name, status, statusUpdate) {
		this.setState({
			show: true,
			modal: "device",
			device: { id: id, name: name, status: status, callback: statusUpdate }
		});
	}

	deviceStatusClick(id, callbacks, errorCallback) {
		if (!errorCallback) {
			return this.api.statusDevice(id, callbacks, this.apiError);
		}

		this.api.statusDevice(id, callbacks, errorCallback);
	}

	videoClick() {}

	closeModal(e) {
		this.setState({ show: false });
	}

	renderModal() {
		const device = this.state.device;
		const modal = this.state.modal;

		if (!this.state.show) {
			return null;
		}

		switch (modal) {
			case "add-device":
				return (
					<AddFormModal
						title="Register Device"
						type="device"
						onClose={this.closeModal}
						submit={this.onFormSubmit}
						ref={modal}
					/>
				);
			case "add-lecturer":
				return (
					<AddFormModal
						title="Add Lecturer"
						type="lecturer"
						onClose={this.closeModal}
						submit={this.onFormSubmit}
						ref={modal}
					/>
				);
			case "device":
				return (
					<DeviceModal
						title={device.name}
						deviceId={device.id}
						onClose={this.closeModal}
						submit={this.onFormSubmit}
						onStatusClick={this.deviceStatusClick}
						deviceCallback={device.callback}
						status={device.status}
						ref={modal}
					/>
				);
			case "video":
			default:
				return null;
		}
	}

	renderContent() {
		const lecturer = this.props.lecturer;
		const videos = this.state.videos;
		const devices = this.state.devices;

		// if viewer then dont render devices
		let deviceList = null;
		if (lecturer) {
			deviceList = (
				<DeviceList
					devices={devices}
					deviceClick={this.deviceClick}
					statusClick={this.deviceStatusClick}
					addClick={this.addDeviceClick}
				/>
			);
		}

		return (
			<div className="ContentArea">
				{deviceList}
				<VideoList
					lecturer={lecturer}
					videos={videos}
					videoClick={this.videoClick}
					addClick={this.addLecturerClick}
				/>
			</div>
		);
	}

	render() {
		const auth = this.props.auth;

		document.title = "LectureFly | Dash";
		return (
			<div>
				{auth ? this.renderContent() : null}
				{this.renderModal()}
			</div>
		);
	}
}

export default DashContent;
