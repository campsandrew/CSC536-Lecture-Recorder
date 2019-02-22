import React, { Component } from "react";
import "./css/VideoList.css";

import TitleBar from "./TitleBar";
import Video from "./Video";

class VideoList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			videos: []
		};
	}

	componentDidMount() {
		this.setState({
			videos: this.getVideos()
		});
	}

	/**
	 * Ajax request for recordings of current user
	 */
	getVideos() {
		var videos = [
			{
				id: 0,
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				date: new Date(),
				length: "1000",
				name: "Sample Video"
			},
			{
				id: 1,
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				date: new Date(),
				length: "1000",
				name: "Sample Video"
			}
		];

		//TODO: Ajax request
		return videos;
	}

	render() {
		const videoList = this.state.videos.map(video => (
			<Video title={video.name} url={video.url} key={video.id} />
		));

		return (
			<div className="VideoList">
				<TitleBar title="Recordings" />
				<ul>{videoList}</ul>
			</div>
		);
	}
}

export default VideoList;
