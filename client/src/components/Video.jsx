import React from "react";
import "./css/Video.css";

function Video({ lecturer, video, onVideoClick, onRemoveClick }) {
	let creator = lecturer ? video.device : video.creator;

	function onClick(e) {
		if (e.target.id === "remove") {
			return onRemoveClick(video.id, video.name);
		}

		onVideoClick(video.id, video.name);
	}

	return (
		<li className="Video" onClick={onClick}>
			<div className="video-content">
				{lecturer ? (
					<div onClick={onClick} className="remove" id="remove">
						-
					</div>
				) : null}
				<video controls>
					<source src={video.src} type="video/mp4" />
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

export default Video;
