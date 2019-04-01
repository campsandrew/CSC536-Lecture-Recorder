import React, { Component } from "react";
import "./css/CameraFeed.css";
//import noStream from "./images/teaching.jpg";

class CameraFeed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			refresh: true
		};

		this.refresh = this.refresh.bind(this);
		this.refreshTimer = null;
	}

	componentDidMount() {
		const fps = this.props.fps;

		this.refreshTimer = setInterval(this.refresh, 1000 / fps);
	}

	// componentDidUpdate(prevProps) {
	// 	const connected = this.props.connected;
	// 	const fps = this.props.fps;

	// 	if (!connected && this.refreshTimer !== null) {
	// 		clearInterval(this.refreshTimer);
	// 		this.refreshTimer = null;
	// 		return;
	// 	}

	// 	if (connected && this.refreshTimer === null) {
	// 		this.refreshTimer = setInterval(this.refresh, 1000 / fps);
	// 	}
	// }

	componentWillUnmount() {
		clearInterval(this.refreshTimer);
	}

	refresh() {
		this.setState({
			refresh: true
		});
	}

	render() {
		const feed = this.props.feed;

		return (
			<div className="CameraFeed">
				<img src={feed + "?" + new Date().getTime()} alt="live camera feed" />
			</div>
		);
	}
}

export default CameraFeed;
