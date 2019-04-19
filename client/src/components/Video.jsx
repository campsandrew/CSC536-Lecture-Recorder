import React from "react";
import "./css/Video.css";

function Video({ isLecturer, video, videoClick, removeClick }) {
	let creator = isLecturer ? video.device : video.creator;

	console.log(video.src);

	return (
		<li className="Video" onClick={e => videoClick(video)}>
			<div className="video-content">
				{isLecturer ? (
					<div onClick={e => removeClick(video)} className="remove" id="remove">
						-
					</div>
				) : null}
				<video controls>
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

export default Video;
