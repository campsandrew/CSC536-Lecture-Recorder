import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import axios from "axios";
import "./css/App.css";

import HeaderBar from "./HeaderBar";
import HomeContent from "./HomeContent";
import DashContent from "./DashContent";
import ErrorContent from "./ErrorContent";

const CONNECTOR_URL =
	"https://0y701umd03.execute-api.us-west-2.amazonaws.com/lambda/ipConnector";

class App extends Component {
	/**
	 *
	 */
	constructor(props) {
		super(props);

		this.connectorUrl = CONNECTOR_URL;
		this.state = {
			server: ""
		};
	}

	/**
	 *
	 */
	componentDidMount() {
		this.serverConnector();
		// TODO:
	}

	/**
	 *
	 */
	serverConnector() {
		const self = this;
		const config = { crossdomain: true };

		// Get server address from connector
		axios
			.get(this.connectorUrl, config)
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

	/**
	 *
	 */
	render() {
		const server = this.state.server;
		const routing = (
			<BrowserRouter>
				<HeaderBar server={server} />
				<Switch>
					<Route
						exact
						path="/"
						render={() => <HomeContent server={server} />}
					/>
					<Route
						exact
						path="/dash"
						render={() => <DashContent server={server} />}
					/>
					<Route render={() => <ErrorContent />} />
				</Switch>
			</BrowserRouter>
		);

		return routing;
	}
}

export default App;
