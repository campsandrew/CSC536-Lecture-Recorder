import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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

		// Class variables
		this.api = null;
		this.fps = 10;
		this.statusCodes = {
			offline: 2,
			recording: 1,
			online: 0
		};
		this.modalTypes = {
			device: "device",
			video: "video",
			addDevice: "add-device",
			removeDevice: "remove-device",
			addLecturer: "add-lecturer",
			removeVideo: "remove-video"
		};

		// Initial state
		this.state = {
			videos: [],
			devices: [],
			modal: {
				show: false
			}
		};

		// Api method bindings
		this.apiGetDevicesSuccess = this.apiGetDevicesSuccess.bind(this);
		this.apiGetStatusSuccess = this.apiGetStatusSuccess.bind(this);
		this.apiGetVideosSuccess = this.apiGetVideosSuccess.bind(this);
		this.apiSuccess = this.apiSuccess.bind(this);
		this.apiError = this.apiError.bind(this);

		// Device method bindings
		this.onAddDeviceClick = this.onAddDeviceClick.bind(this);
		this.onRemoveDeviceClick = this.onRemoveDeviceClick.bind(this);
		this.onDeviceClick = this.onDeviceClick.bind(this);
		this.onStatusClick = this.onStatusClick.bind(this);
		this.onShutdownClick = this.onShutdownClick.bind(this);

		// Video method bindings
		this.onAddLecturerClick = this.onAddLecturerClick.bind(this);
		this.onRemoveVideoClick = this.onRemoveVideoClick.bind(this);
		this.onVideoClick = this.onVideoClick.bind(this);
		this.onPlayVideoClick = this.onPlayVideoClick.bind(this);

		// Modal method bindings
		this.onModalSubmit = this.onModalSubmit.bind(this);
		this.onModalClose = this.onModalClose.bind(this);

		// Device status information
		this.deviceOffline = d =>
			d.status === this.statusCodes.offline ? true : false;
		this.deviceRecording = d =>
			d.status === this.statusCodes.recording ? true : false;
		this.deviceOnline = d =>
			d.status === this.statusCodes.online ? true : false;
	}

	componentDidUpdate(prevProps) {
		const lecturer = this.props.lecturer;
		const server = this.props.server;

		// Create api and get video content
		if (this.api === null && server && lecturer !== undefined) {
			this.api = new API(server);
			this.api.getVideos(this.apiGetVideosSuccess, this.apiError);

			if (lecturer) {
				this.api.getDevices(this.apiGetDevicesSuccess, this.apiError);
			}
		}
	}

	/**
	 * Api Callback Methods
	 */
	apiGetDevicesSuccess(data) {
		let devices = data.devices;
		for (let device of devices) {
			device.status = this.statusCodes.offline;
			this.onStatusClick(device);
		}

		this.setState({ devices: devices });
	}
	apiGetStatusSuccess(data) {
		let devices = this.state.devices;

		// Add updated status to device
		for (let device of devices) {
			if (device.id === data.id) {
				device.status = data.status;
				device.address = data.address;
			}
		}

		this.setState({ devices: devices });
	}
	apiGetVideosSuccess(data) {
		let videos = data.videos.reverse();

		for (let video of videos) {
			video.src = this.api.getVideoSrc(video);
		}

		this.setState({ videos: videos });
	}
	apiSuccess(data) {
		const modal = this.state.modal;
		let devices = this.state.devices;
		let videos = this.state.videos;
		let newState = {};

		switch (modal.type) {
			case this.modalTypes.addDevice:
				data.device.status = this.statusCodes.offline;
				devices.push(data.device);
				newState.devices = devices;
				this.onStatusClick(data.device);
				break;
			case this.modalTypes.removeDevice:
				for (let i in devices) {
					if (devices[i].id === data.device.id) {
						devices.splice(i, 1);
					}
				}

				newState.devices = devices;
				break;
			case this.modalTypes.addLecturer:
				this.api.getVideos(this.apiGetVideosSuccess, this.apiError);
				break;
			case this.modalTypes.removeVideo:
				for (let i in videos) {
					if (videos[i].id === data.video.id) {
						videos.splice(i, 1);
					}
				}

				newState.videos = videos;
				break;
			case this.modalTypes.device:
				// Add new video to list
				if (data.video) {
					this.api.getVideos(this.apiGetVideosSuccess, this.apiError);
					// videos.push(data.video);
					// newState.videos = videos;
				}

				// Update device status
				if (data.device) {
					for (let device of devices) {
						if (device.id === data.device.id) {
							device.status = data.device.status;
							break;
						}
					}
					newState.devices = devices;
				}

				break;
			case this.modalTypes.video:
			default:
		}

		newState.modal = { show: false };
		this.setState(newState);
	}

	apiError(data) {
		const modal = this.state.modal;

		if (modal.show) {
			this.refs[modal.type].submitError(data.message);
		}

		// Updating device status if no contact is made
		if (data.hasOwnProperty("id")) {
			data.status = this.statusCodes.offline;
			this.apiGetStatusSuccess(data);
		}

		console.log(data.message);
	}

	/**
	 * Modal Events
	 */
	onModalSubmit(content, id) {
		const modal = this.state.modal;

		if (this.api === null) {
			let message = "server connection error";
			return this.refs[modal].submitError(message);
		}

		switch (modal.type) {
			case this.modalTypes.addDevice:
				this.api.addDevice(content, this.apiSuccess, this.apiError);
				break;
			case this.modalTypes.removeDevice:
				this.api.deleteDevice(id, this.apiSuccess, this.apiError);
				break;
			case this.modalTypes.addLecturer:
				this.api.addLecturer(content, this.apiSuccess, this.apiError);
				break;
			case this.modalTypes.removeVideo:
				this.api.deleteVideo(id, this.apiSuccess, this.apiError);
				break;
			case this.modalTypes.device:
				this.api.recordDevice(
					id,
					content,
					this.deviceRecording(modal.device),
					this.apiSuccess,
					this.apiError
				);
				break;
			case this.modalTypes.video:
			default:
		}
	}

	onModalClose(e) {
		this.setState({
			modal: {
				show: false
			}
		});
	}

	/**
	 * Video Click Events
	 */
	onAddLecturerClick() {
		this.setState({
			modal: {
				show: true,
				type: this.modalTypes.addLecturer
			}
		});
	}
	onVideoClick(video) {}
	onRemoveVideoClick(video) {
		this.setState({
			modal: {
				show: true,
				type: this.modalTypes.removeVideo,
				video: video
			}
		});
	}
	onPlayVideoClick(video) {
		this.api.addViewVideo(video.id, this.apiSuccess, this.apiError);
	}

	/**
	 * Device Click Events
	 */
	onDeviceClick(device) {
		this.setState({
			modal: {
				show: true,
				type: this.modalTypes.device,
				device: device
			}
		});
	}
	onAddDeviceClick(e) {
		this.setState({
			modal: {
				show: true,
				type: this.modalTypes.addDevice
			}
		});
	}
	onRemoveDeviceClick(device) {
		this.setState({
			modal: {
				show: true,
				type: this.modalTypes.removeDevice,
				device: device
			}
		});
	}
	onStatusClick(device) {
		this.api.statusDevice(device.id, this.apiGetStatusSuccess, this.apiError);
	}
	onShutdownClick(device) {
		this.api.shutdownDevice(device.id, this.apiSuccess, this.apiError);
	}

	/**
	 * Render Methods
	 */
	renderModal() {
		const modal = this.state.modal;

		switch (modal.type) {
			case this.modalTypes.addDevice:
				return (
					<AddFormModal
						type="device"
						onSubmit={this.onModalSubmit}
						onClose={this.onModalClose}
						ref={modal.type}
					/>
				);
			case this.modalTypes.removeDevice:
				return (
					<RemoveFormModal
						device={modal.device}
						onSubmit={this.onModalSubmit}
						onClose={this.onModalClose}
						ref={modal.type}
					/>
				);
			case this.modalTypes.addLecturer:
				return (
					<AddFormModal
						type="lecturer"
						onSubmit={this.onModalSubmit}
						onClose={this.onModalClose}
						ref={modal.type}
					/>
				);
			case this.modalTypes.removeVideo:
				return (
					<RemoveFormModal
						video={modal.video}
						onSubmit={this.onModalSubmit}
						onClose={this.onModalClose}
						ref={modal.type}
					/>
				);
			case this.modalTypes.device:
				return (
					<DeviceModal
						device={modal.device}
						offline={this.deviceOffline(modal.device)}
						recording={this.deviceRecording(modal.device)}
						statusClick={this.onStatusClick}
						onSubmit={this.onModalSubmit}
						onClose={this.onModalClose}
						ref={modal.type}
					/>
				);
			case this.modalTypes.video:
			default:
				return null;
		}
	}

	renderContent() {
		const lecturer = this.props.lecturer;
		const videos = this.state.videos;
		const devices = this.state.devices;

		let deviceList = null;
		let cameraFeeds = null;

		// if viewer then dont render devices
		if (lecturer) {
			deviceList = (
				<DeviceList
					devices={devices}
					addClick={this.onAddDeviceClick}
					deviceClick={this.onDeviceClick}
					statusClick={this.onStatusClick}
					removeClick={this.onRemoveDeviceClick}
				/>
			);
			cameraFeeds = devices.map(device => {
				if (this.deviceRecording(device) || this.deviceOnline(device)) {
					return (
						<CameraFeedWindow
							device={device}
							fps={this.fps}
							feedError={this.onStatusClick}
							shutdown={this.onShutdownClick}
							key={device.id}
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
					videos={videos}
					isLecturer={lecturer}
					addClick={this.onAddLecturerClick}
					videoClick={this.onVideoClick}
					removeClick={this.onRemoveVideoClick}
					playClick={this.onPlayVideoClick}
				/>
			</div>
		);
	}

	render() {
		const auth = this.props.auth;
		const showModal = this.state.modal.show;

		document.title = "LectureFly | Dash";
		return (
			<div>
				{!auth ? <Redirect to="/unauthorized" /> : null}
				{this.renderContent()}
				{showModal ? this.renderModal() : null}
			</div>
		);
	}
}

export default DashContent;
