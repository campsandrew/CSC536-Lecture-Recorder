import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import HeaderBar from "./HeaderBar";
import HomeContent from "./HomeContent";
import DashContent from "./DashContent";
import ErrorContent from "./ErrorContent";
import API from "../api";
import Auth from "../authentication";

class App extends Component {
	/**
	 *
	 */
	constructor(props) {
		super(props);

		this.auth = new Auth();

		this.state = {
			server: "",
			authenticated: this.auth.isAuthenticated(),
			user: {}
		};

		this.apiGetUserSuccess = this.apiGetUserSuccess.bind(this);
		this.apiConnectorSuccess = this.apiConnectorSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.api = new API(props.connector, false);
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
		const auth = this.state.authenticated;

		this.api = new API(data.address);
		this.setState({
			server: data.address
		});

		if (auth) {
			this.api.getUser(this.apiGetUserSuccess, this.apiError);
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
		this.setState({ authenticated: false });
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
								lecturer={user.lecturer}
								auth={auth}
							/>
						)}
					/>
					<Route
						render={() => <ErrorContent path={window.location.pathname} />}
					/>
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
