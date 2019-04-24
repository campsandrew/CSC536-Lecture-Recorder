import React, { Component } from "react";
import "./css/Video.css";

class Video extends Component {
	constructor(props) {
		super(props);

		this.state = {
			viewed: false
		};

		this.onPlayClick = this.onPlayClick.bind(this);
		this.onVideoClick = this.onVideoClick.bind(this);
	}

	onPlayClick(e) {
		const viewed = this.state.viewed;
		const video = this.props.video;

		if (!viewed) {
			this.props.playClick(video);
			this.setState({ viewed: true });
		}
	}

	onVideoClick(e) {
		const videoClick = this.props.videoClick;
		const video = this.props.video;

		if (e.target.id === "remove") {
			return;
		}

		if (this.refs.video.mozRequestFullScreen) {
			this.refs.video.mozRequestFullScreen();
		} else if (this.refs.video.webkitRequestFullScreen) {
			this.refs.video.webkitRequestFullScreen();
		}

		this.refs.video.play();
		videoClick(video);
	}

	render() {
		const video = this.props.video;
		const removeClick = this.props.removeClick;
		const isLecturer = this.props.isLecturer;
		const creator = isLecturer ? video.device : video.creator;

		return (
			<li className="Video" onClick={this.onVideoClick}>
				<div className="video-content">
					{isLecturer ? (
						<div
							onClick={e => removeClick(video)}
							className="remove"
							id="remove"
						>
							-
						</div>
					) : null}
					<video onPlay={this.onPlayClick} ref="video" controls>
						<source src={video.src} type="video/webm" />
					</video>
				</div>
				<div>
					<h3>{video.name}</h3>
					<div className="summary">
						{creator}
						<br />
						{video.views} Views &#8729; {video.date}
					</div>
					<p>{video.description}</p>
				</div>
			</li>
		);
	}
}

export default Video;
