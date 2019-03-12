import React, { Component } from "react";
import axios from "axios";
import "./css/App.css";

import HeaderBar from "./HeaderBar";
import ContentArea from "./ContentArea";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			server: ""
		};
	}

	componentWillMount() {
		const connector = "http://3.18.165.55:8080/connector";

		this.serverConnector(connector);
	}

	/**
	 *
	 */
	serverConnector(url) {
		const self = this;
		const config = {
			crossdomain: true
		};

		// Get server address from connector
		axios
			.get(url, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return;
				}

				self.setState({
					server: res.data.address
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		const server = this.state.server;

		return (
			<div>
				<HeaderBar loggedIn={true} />
				<ContentArea server={server} />
			</div>
		);
	}
}

export default App;
