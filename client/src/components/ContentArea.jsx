import React, { Component } from "react";
import "./css/ContentArea.css";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

const ROUTES = {
	"/": {
		title: "LectureFly | Home",
		page: <div className="ContentArea" />
	},
	"/dashboard": {
		title: "LectureFly | Dash",
		page: (
			<div className="ContentArea">
				<DeviceList />
				<VideoList />
			</div>
		)
	}
};

class ContentArea extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: ""
		};
	}

	componentDidMount() {
		const route = ROUTES[window.location.pathname];

		this.setState({
			page: route.page
		});
		document.title = route.title;
	}

	render() {
		return this.state.page;
	}
}

export default ContentArea;
