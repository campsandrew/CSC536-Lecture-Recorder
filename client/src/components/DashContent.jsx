import React, { Component } from "react";
import "./css/ContentArea.css";

import AddFormModal from "./AddFormModal";
import RemoveFormModal from "./RemoveFormModal";
import DeviceModal from "./DeviceModal";
import DeviceList from "./DeviceList";
import VideoList from "./VideoList";
import CameraFeedWindow from "./CameraFeedWindow";
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
		this.removeDeviceClick = this.removeDeviceClick.bind(this);
		this.addLecturerClick = this.addLecturerClick.bind(this);
		this.removeVideoClick = this.removeVideoClick.bind(this);
		this.deviceStatusClick = this.deviceStatusClick.bind(this);
		this.deviceClick = this.deviceClick.bind(this);
		this.videoClick = this.videoClick.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.apiSuccess = this.apiSuccess.bind(this);
		this.apiVideosSuccess = this.apiVideosSuccess.bind(this);
		this.apiStatusChange = this.apiStatusChange.bind(this);
		this.apiError = this.apiError.bind(this);
	}

	componentDidUpdate(prevProps) {
		const lecturer = this.props.lecturer;
		const server = this.props.server;

		// Create api and get video content
		if (this.api === null && server && lecturer !== undefined) {
			this.api = new API(server);
			this.api.getVideos(this.apiVideosSuccess, this.apiError);

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
		const devices = this.state.devices;

		if (this.api === null) {
			this.refs[modal].submitError("no connection to servers");
			return;
		}

		switch (modal) {
			case "add-device":
				this.api.addDevice(content, this.apiSuccess, this.apiError);
				break;
			case "remove-device":
				this.api.deleteDevice(id, this.apiSuccess, this.apiError);
				break;
			case "add-lecturer":
				this.api.addLecturer(content, this.apiSuccess, this.apiError);
				break;
			case "remove-video":
				this.api.deleteVideo(id, this.apiSuccess, this.apiError);
				break;
			case "device":
				let device;
				for (let d of devices) {
					if (id === d.id) device = d;
				}

				if (!device.recording) {
					this.api.addVideo(id, content, this.apiSuccess, this.apiError);
					this.api.recordDevice(id, true, this.apiSuccess, this.apiError);
				} else {
					this.api.recordDevice(id, false, this.apiSuccess, this.apiError);
				}
				break;
			case "video":
			default:
		}
	}

	apiSuccess(data) {
		const modal = this.state.modal;
		let devices = this.state.devices;
		let videos = this.state.videos;

		switch (modal) {
			case "add-device":
				devices.push(data.device);
				this.setState({ devices: devices, show: false });
				break;
			case "remove-device":
				for (let i in devices) {
					if (devices[i].id === data.device.id) {
						devices.splice(i, 1);
					}
				}

				this.setState({ devices: devices, show: false });
				break;
			case "add-lecturer":
				this.api.getVideos(this.apiVideosSuccess, this.apiError);
				this.setState({ show: false });
				break;
			case "remove-video":
				for (let i in videos) {
					if (videos[i].id === data.video.id) {
						videos.splice(i, 1);
					}
				}

				this.setState({ videos: videos, show: false });
				break;
			case "device":
				if (data.video) {
					videos.push(data.video);
					return this.setState({ videos: videos });
				}

				if (data.recording) {
					for (let i in devices) {
						if (devices[i].id === data.id) {
							devices[i].recording = true;
							devices[i].status = data.status;
							break;
						}
					}
					return this.setState({ devices: devices, show: false });
				}

				if (data.recording === false) {
					for (let i in devices) {
						if (devices[i].id === data.id) {
							devices[i].recording = false;
							devices[i].status = data.status;
							break;
						}
					}
					return this.setState({ devices: devices, show: false });
				}

				break;
			case "video":
			default:
		}
	}

	apiVideosSuccess(data) {
		let videos = data.videos;

		for (let i in videos) {
			videos[i].src = this.api.getVideoSrc(videos[i].id, videos[i].filename);
		}

		this.setState({ videos: data.videos });
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

	removeDeviceClick(id, name) {
		this.setState({
			show: true,
			modal: "remove-device",
			device: { id: id, name: name }
		});
	}

	addLecturerClick() {
		this.setState({
			show: true,
			modal: "add-lecturer"
		});
	}

	removeVideoClick(id, name) {
		this.setState({
			show: true,
			modal: "remove-video",
			video: { id: id, name: name }
		});
	}

	deviceClick(id, name, status, statusUpdate) {
		this.deviceStatusClick(id, statusUpdate, this.apiError);
		this.setState({
			show: true,
			modal: "device",
			device: { id: id, name: name, status: status, callback: statusUpdate }
		});
	}

	deviceStatusClick(id, successCbs, errorCbs) {
		const addIn = (cb, add) => {
			if (Array.isArray(cb)) {
				cb.push(add);
				return cb;
			}

			if (!cb) {
				return [this.apiError, add];
			}

			return [cb, add];
		};

		successCbs = addIn(successCbs, this.apiStatusChange);
		errorCbs = addIn(errorCbs, this.apiStatusChange);

		return this.api.statusDevice(id, successCbs, errorCbs);
	}

	// This is some shit code i need to fix
	apiStatusChange(data, data2) {
		const addStatus = (data, status) => {
			for (let i in devices) {
				if (devices[i].id === data.id) {
					devices[i].status = status;
					devices[i].address = data.address;
				}
			}
		};

		let devices = this.state.devices;
		if (data && data.hasOwnProperty("status") && data.hasOwnProperty("id")) {
			addStatus(data, data.status);
		} else if (
			data2 &&
			data2.hasOwnProperty("status") &&
			data2.hasOwnProperty("id")
		) {
			addStatus(data2, data2.status);
		} else if (data && data.hasOwnProperty("id")) {
			addStatus(data, 2);
		} else if (data2 && data2.hasOwnProperty("id")) {
			addStatus(data2, 2);
		} else {
			return;
		}

		this.setState({ devices: devices });
	}

	videoClick() {}

	closeModal(e) {
		this.setState({ show: false });
	}

	renderModal() {
		const video = this.state.video;
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
			case "remove-device":
				return (
					<RemoveFormModal
						title="Delete Device"
						id={device.id}
						name={device.name}
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
			case "remove-video":
				return (
					<RemoveFormModal
						title="Delete Video"
						id={video.id}
						name={video.name}
						type="video"
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
		let cameraFeeds = null;
		if (lecturer) {
			deviceList = (
				<DeviceList
					devices={devices}
					deviceClick={this.deviceClick}
					statusClick={this.deviceStatusClick}
					addClick={this.addDeviceClick}
					removeClick={this.removeDeviceClick}
				/>
			);
			cameraFeeds = devices.map(device => {
				if (device.status === 1 || device.status === 0) {
					return (
						<CameraFeedWindow
							device={device}
							url={device.address + "/live"}
							key={device.id}
							feedError={this.deviceStatusClick}
						/>
					);
				}

				return null;
			});
		}

		return (
			<div className="ContentArea">
				{deviceList}
				{cameraFeeds}
				<VideoList
					lecturer={lecturer}
					videos={videos}
					videoClick={this.videoClick}
					addClick={this.addLecturerClick}
					removeClick={this.removeVideoClick}
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
