import React, { Component } from "react";
import "./css/CameraFeed.css";

class CameraFeed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			refresh: true
		};

		this.refresh = this.refresh.bind(this);
		this.onError = this.onError.bind(this);
		this.refreshTimer = null;
	}

	componentDidMount() {
		const fps = this.props.fps;

		this.refreshTimer = setInterval(this.refresh, 1000 / fps);
	}

	componentWillUnmount() {
		clearInterval(this.refreshTimer);
	}

	refresh() {
		this.setState({
			refresh: true
		});
	}

	onError(e) {
		this.props.feedError(this.props.device);
	}

	render() {
		const url = this.props.device.address + "/live";

		return (
			<div className="CameraFeed">
				<img
					src={url + "?" + new Date().getTime()}
					alt="live camera feed"
					onError={this.onError}
				/>
			</div>
		);
	}
}

export default CameraFeed;
