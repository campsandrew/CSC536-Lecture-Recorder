import React, { Component } from "react";
import "./css/VideoList.css";

import TitleBar from "./TitleBar";
import Video from "./Video";
//import Modal from "./Modal";

class VideoList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			videos: [
				// {
				// 	id: 0,
				// 	name: "Sample Video",
				// 	url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				// 	device: "Test Device",
				// 	lecturer: "Lecturer Name",
				// 	views: 10,
				// 	date: "2/29/2019",
				// 	description: "Sample video pulled from youtube"
				// },
				// {
				// 	id: 1,
				// 	name: "Test Device",
				// 	url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				// 	device: "My Camera",
				// 	date: "2/29/2019",
				// 	lecturer: "Lecturer Name",
				// 	views: 10,
				// 	description: "Sample video pulled from youtube"
				// },
				// {
				// 	id: 2,
				// 	name: "Test Device",
				// 	url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				// 	device: "Backup",
				// 	date: "2/29/2019",
				// 	lecturer: "Lecturer Name",
				// 	views: 10,
				// 	description: "Sample video pulled from youtube"
				// }
			],
			modal: {
				show: false
			}
		};

		this.onVideoClick = this.onVideoClick.bind(this);
		this.onAddLecturerClick = this.onAddLecturerClick.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
		this.onDeleteClick = this.onDeleteClick.bind(this);
	}

	onVideoClick(e, video) {
		this.setState({
			modal: {
				show: true,
				title: video.getName(),
				content: "video",
				primary: "Close",
				secondary: "Delete"
				// action: {
				// 	type: "status",
				// 	status: device.getStatus(),
				// 	onClick: device.onStatusUpdate
				// }
			}
		});
	}

	onAddLecturerClick(e) {
		this.setState({
			modal: {
				show: true,
				title: "New Lecturer",
				content: "add-lecturer",
				primary: "Add",
				secondary: "Close"
			}
		});
	}

	onModalClose(e) {
		this.setState({
			modal: {
				show: false
			}
		});
	}

	onDeleteClick(e) {
		this.setState({
			modal: {
				show: false
			}
		});
	}

	renderVideoContent() {
		const lecturer = this.props.isLecturer;
		const videoDetails = this.state.videos;

		if (!videoDetails.length) {
			return <div className="no-video">no recorded lectures</div>;
		}

		return (
			<ul>
				{videoDetails.map(video => (
					<Video
						isLecturer={lecturer}
						details={video}
						onClick={this.onVideoClick}
						key={video.id}
					/>
				))}
			</ul>
		);
	}

	render() {
		const lecturer = this.props.lecturer;
		//const modal = this.state.modal;
		let titleBar = <TitleBar title="Recordings" />;

		// Change this based on user type true for Viewer
		if (!lecturer) {
			titleBar = (
				<TitleBar
					title="Recordings"
					action={{ type: "add", onClick: this.onAddLecturerClick }}
				/>
			);
		}

		return (
			<div className="VideoList">
				{titleBar}
				{this.renderVideoContent()}
				{/*				<Modal
					show={modal.show}
					title={modal.title}
					primary={modal.primary}
					secondary={modal.secondary}
					onPrimary={this.onModalClose}
					onSecondary={this.onDeleteClick}
					action={modal.action}
					content={modal.content}
				/>*/}
			</div>
		);
	}
}

export default VideoList;
