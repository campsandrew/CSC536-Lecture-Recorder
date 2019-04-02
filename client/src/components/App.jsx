import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

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
			user: {}
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
		const authenticated = this.auth.isAuthenticated();
		const authState = this.state.authenticated;

		this.setState({
			server: data.address
		});

		this.api = new API(data.address);
		if (authenticated && !authState) {
			this.setState({
				authenticated: true
			});

			return this.api.getUser(this.apiGetUserSuccess, this.apiError);
		}

		if (!authenticated && authState) {
			this.setState({
				authenticated: false
			});

			return;
		}
	}

	/**
	 *
	 */
	apiGetUserSuccess(data) {
		this.setState({
			user: {
				name: data.name,
				lecturer: data.type.toLowerCase() === "lecturer"
			}
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
	}

	/**
	 *
	 */
	render() {
		const server = this.state.server;
		const user = this.state.user;
		const auth = this.state.authenticated;
		const routing = (
			<BrowserRouter>
				<Switch>
					<Route
						exact
						path="/"
						render={() => <HomeContent server={server} auth={auth} />}
					/>
					<Route
						exact
						path="/dash"
						render={() => (
							<DashContent
								server={server}
								auth={auth}
								lecturer={user.lecturer}
							/>
						)}
					/>
					<Route render={() => <ErrorContent />} />
				</Switch>
			</BrowserRouter>
		);

		return (
			<div>
				<HeaderBar auth={auth} user={user} onLogout={this.onLogout} />
				{routing}
			</div>
		);
	}
}

export default App;
