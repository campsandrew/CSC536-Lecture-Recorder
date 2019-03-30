import React, { Component } from "react";
import "./css/Video.css";

class Video extends Component {
	// constructor(props) {
	// 	super(props);
	// }

	// const click = props.onClick;
	// const { id, name, url, length, camera, date, description } = props.details;

	/*	function formatDuration(length) {
		var minutes = length / 60;

		return minutes.toFixed(2) + " mins";
	}*/

	// formatDate(date) {
	// 	return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
	// }

	getName() {
		return this.props.details.name;
	}

	renderVideoInfo() {
		const info = this.props.details;
		let creator = info.device;

		// Check if user if a viewer
		if (false) {
			creator = info.lecturer;
		}

		return (
			<div>
				<h3>{info.name}</h3>
				<div id="summary">
					{creator}
					<br />
					{info.views} Views &#8729; {info.date}
				</div>
				<p>{info.description}</p>
			</div>
		);
	}

	renderVideo() {
		const info = this.props.details;

		return (
			<iframe
				title={info.name}
				src={info.url}
				frameBorder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		);
	}

	render() {
		const onClick = this.props.onClick;

		return (
			<div className="Video" onClick={e => onClick(e, this)}>
				{this.renderVideo()}
				{this.renderVideoInfo()}
			</div>
		);
	}
}

export default Video;
