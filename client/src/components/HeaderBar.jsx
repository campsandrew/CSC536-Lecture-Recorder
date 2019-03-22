import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "./css/HeaderBar.css";

import Logo from "./Logo";

class HeaderBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			server: null,
			user: null
		};

		this.onLogout = this.onLogout.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		if (props.server !== state.server) {
			return { server: props.server };
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.server !== this.state.server) {
			this.getUser();
			this.setState({
				server: this.state.server
			});
		}
	}

	getUser() {
		const url = this.state.server + "/user?name=true";
		const token = sessionStorage.accessToken;
		const config = {
			crossdomain: true,
			headers: { accessToken: token }
		};
		const self = this;

		if (!token) {
			return;
		}

		// Try to get user
		axios
			.get(url, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return;
				}

				self.setState({
					user: res.data.name
				});
			})
			.catch(err => console.log(err));
	}

	onLogout(e) {
		this.setState({
			user: null
		});
		sessionStorage.removeItem("accessToken");
		window.location.replace("/");
	}

	render() {
		const user = this.state.user;
		let logout = null;

		if (user) {
			logout = <button onClick={this.onLogout}>Logout</button>;
		}

		return (
			<header className="HeaderBar">
				<Logo />
				<span>{user}</span>
				<nav>{logout}</nav>
			</header>
		);
	}
}

export default HeaderBar;
