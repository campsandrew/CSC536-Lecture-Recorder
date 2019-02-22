import React from "react";
import "./css/Video.css";

function Video(props) {
	return (
		<div className="Video">
			<iframe
				title={props.title}
				src={props.url}
				frameBorder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}

export default Video;
