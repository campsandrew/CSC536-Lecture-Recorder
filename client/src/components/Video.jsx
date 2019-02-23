import React from "react";
import "./css/Video.css";

function Video(props) {
	const click = props.onClick;
	const { name, url, length, camera, date, description } = props.details;

	function formatDuration(length) {
		var minutes = length / 60;

		return minutes.toFixed(2) + " mins";
	}

	function formatDate(date) {
		return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
	}

	return (
		<div className="Video" onClick={e => click(e, name)}>
			<iframe
				title={name}
				src={url}
				frameBorder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<div>
				<h3>{name}</h3>
				<div id="summary">
					{camera} &#8729; {formatDuration(length)} &#8729; {formatDate(date)}
				</div>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default Video;
