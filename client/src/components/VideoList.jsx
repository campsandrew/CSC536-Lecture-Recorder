import React, { Component } from "react";
import "./css/VideoList.css";

import TitleBar from "./TitleBar";
import Video from "./Video";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

class VideoList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			videos: [
				{
					id: 0,
					name: "Sample Video",
					url: "https://www.youtube.com/embed/HjxYvcdpVnU",
					camera: "Test Device",
					date: new Date(),
					length: 22,
					description: "Sample video pulled from youtube"
				},
				{
					id: 1,
					name: "Test Device",
					url: "https://www.youtube.com/embed/HjxYvcdpVnU",
					camera: "My Camera",
					date: new Date(),
					length: 22,
					description: "Sample video pulled from youtube"
				},
				{
					id: 2,
					name: "Test Device",
					url: "https://www.youtube.com/embed/HjxYvcdpVnU",
					camera: "Backup",
					date: new Date(),
					length: 22,
					description: "Sample video pulled from youtube"
				}
			],
			modal: {
				show: false,
				title: "",
				content: null,
				primary: null
			}
		};

		this.onVideoClick = this.onVideoClick.bind(this);
	}

	onVideoClick(e, video) {
		this.setState({
			modal: {
				show: true,
				title: video.getName(),
				content: "video",
				primary: "Delete"
				// action: {
				// 	type: "status",
				// 	status: device.getStatus(),
				// 	onClick: device.onStatusUpdate
				// }
			}
		});
	}

	renderVideoContent() {
		const videos = this.state.videos;

		if (!videos.length) {
			return <div className="no-device">no registered devices</div>;
		}

		return (
			<ul>
				{videos.map(video => (
					<Video details={video} onClick={this.onVideoClick} key={video.id} />
				))}
			</ul>
		);
	}

	render() {
		const modal = this.state.modal;

		return (
			<div className="VideoList">
				<TitleBar title="Recordings" />
				<ul>{this.renderVideoContent()}</ul>
				<Modal
					show={modal.show}
					title={modal.title}
					primary={modal.primary}
					onClose={this.onModalClose}
					onPrimary={this.onPrimaryClick}
					action={modal.action}
				>
					<ModalContent content={modal.content} />
				</Modal>
			</div>
		);
	}
}

export default VideoList;
