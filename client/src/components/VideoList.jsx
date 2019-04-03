import React from "react";
import "./css/VideoList.css";

import TitleBar from "./TitleBar";
import Video from "./Video";

function VideoList(props) {
	const { lecturer, videos, videoClick, addClick, removeClick } = props;

	let videoList;
	if (!videos.length) {
		videoList = <div className="no-video">no recorded lectures</div>;
	} else {
		videoList = (
			<ul>
				{videos.map(video => (
					<Video
						lecturer={lecturer}
						video={video}
						onVideoClick={videoClick}
						onRemoveClick={removeClick}
						key={video.id}
					/>
				))}
			</ul>
		);
	}

	return (
		<div className="VideoList">
			<TitleBar title="Recordings">
				{!lecturer ? (
					<div onClick={addClick} className="add">
						+
					</div>
				) : null}
			</TitleBar>
			{videoList}
		</div>
	);
}

export default VideoList;
