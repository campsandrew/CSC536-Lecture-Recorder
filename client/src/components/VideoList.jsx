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
				name: "Sample Video",
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				camera: "My Camera",
				date: new Date(),
				length: 22,
				description: "Sample video pulled from youtube"
			},
			{
				id: 1,
				name: "Sample Video",
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				camera: "My Camera",
				date: new Date(),
				length: 22,
				description: "Sample video pulled from youtube"
			},
			{
				id: 2,
				name: "Sample Video",
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				camera: "Backup",
				date: new Date(),
				length: 22,
				description: "Sample video pulled from youtube"
			},
			{
				id: 3,
				name: "Sample Video",
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				camera: "My Camera",
				date: new Date(),
				length: 22,
				description: "Sample video pulled from youtube"
			},
			{
				id: 4,
				name: "Sample Video",
				url: "https://www.youtube.com/embed/HjxYvcdpVnU",
				camera: "My Camera",
				date: new Date(),
				length: 22,
				description: "Sample video pulled from youtube"
			}
		];

		//TODO: Ajax request
		return videos;
	}

	render() {
		const click = this.props.onClick;
		const videoList = this.state.videos.map(video => (
			<Video details={video} onClick={click} key={video.id} />
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
