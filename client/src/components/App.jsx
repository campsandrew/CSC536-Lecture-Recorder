import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./css/App.css";

import HeaderBar from "./HeaderBar";
import HomeContent from "./HomeContent";
import DashContent from "./DashContent";
import ErrorContent from "./ErrorContent";
import API from "../api";
import Auth from "../authentication";

const CONNECTOR_URL =
	"https://0y701umd03.execute-api.us-west-2.amazonaws.com/lambda/ipConnector";

class App extends Component {
	/**
	 *
	 */
	constructor(props) {
		super(props);

		this.state = {
			server: "",
			authenticated: false,
			userName: ""
		};

		this.apiGetUserSuccess = this.apiGetUserSuccess.bind(this);
		this.apiConnectorSuccess = this.apiConnectorSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.api = new API(CONNECTOR_URL, false);
		this.auth = new Auth();
	}

	/**
	 *
	 */
	componentDidMount() {
		this.api.serverConnector(this.apiConnectorSuccess, this.apiError);
	}

	/**
	 *
	 */
	apiConnectorSuccess(data) {
		this.setState({
			server: data.address
		});

		this.api = new API(data.address);
		if (this.auth.isAuthenticated()) {
			this.api.getUser(this.apiGetUserSuccess, this.apiError);
		} else {
			// TODO: redirect?
		}
	}

	/**
	 *
	 */
	apiGetUserSuccess(data) {
		this.setState({
			userName: data.name
		});
	}

	/**
	 *
	 */
	apiError(err) {
		//TODO: send to error page possibly
	}

	onLogout(e) {
		this.auth.logout();
		window.location.replace("/");
	}

	/**
	 *
	 */
	render() {
		const server = this.state.server;
		const user = this.state.userName;
		const auth = this.auth.isAuthenticated();

		const routing = (
			<BrowserRouter>
				<HeaderBar auth={auth} user={user} onLogout={this.onLogout} />
				<Switch>
					<Route
						exact
						path="/"
						render={() => <HomeContent server={server} auth={auth} />}
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
