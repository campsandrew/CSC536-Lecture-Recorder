import React, { Component } from "react";
import "./css/HeaderBar.css";

import Login from "./Login";
import Logo from "./Logo";

class HeaderBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: ""
		};
	}

	componentDidMount() {
		if (this.props.loggedIn) {
			this.getUser();
		}
	}

	componentWillUnmount() {}

	getUser() {
		var user = "Andrew Camps";

		this.setState({
			user: user
		});
	}

	render() {
		return (
			<header className="HeaderBar">
				<Logo />
				<span>{this.state.user}</span>
				<nav>
					<Login loggedIn={true} />
				</nav>
			</header>
		);
	}
}

export default HeaderBar;
