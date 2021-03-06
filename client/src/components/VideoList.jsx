import React from "react";
import "./css/VideoList.css";

import TitleBar from "./TitleBar";
import Video from "./Video";

function VideoList(props) {
	const {
		isLecturer,
		videos,
		videoClick,
		addClick,
		removeClick,
		playClick
	} = props;

	let videoList;
	if (!videos.length) {
		videoList = <div className="no-video">no recorded lectures</div>;
	} else {
		videoList = (
			<ul>
				{videos.map(video => (
					<Video
						isLecturer={isLecturer}
						video={video}
						videoClick={videoClick}
						removeClick={removeClick}
						playClick={playClick}
						key={video.id}
					/>
				))}
			</ul>
		);
	}

	return (
		<div className="VideoList">
			<TitleBar title="Recordings">
				{!isLecturer ? (
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
