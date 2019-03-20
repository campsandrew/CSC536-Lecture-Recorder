import React, { Component } from "react";
import LoginRegisterForm from "./LoginRegisterForm";

import "./css/ContentArea.css";

class HomeContent extends Component {
	/**
	 *
	 */
	// constructor(props) {
	// 	super(props);
	// }

	/**
	 *
	 */
	render() {
		const server = this.props.server;

		document.title = "LectureFly | Home";
		return (
			<div className="ContentArea justify-end">
				<LoginRegisterForm server={server} />
			</div>
		);
	}
}

export default HomeContent;
