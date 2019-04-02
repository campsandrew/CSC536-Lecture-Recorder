import React, { Component } from "react";
import "./css/ContentArea.css";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import SuccessForm from "./SuccessForm";
import API from "../api";

class HomeContent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			form: "login"
		};

		this.api = null;
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormSwitch = this.onFormSwitch.bind(this);
		this.apiSuccess = this.apiSuccess.bind(this);
		this.apiError = this.apiError.bind(this);
	}

	componentDidUpdate(prevProps) {
		const server = this.props.server;

		if (this.api === null && server) {
			this.api = new API(server);
		}
	}

	apiSuccess(data) {
		const form = this.state.form;

		switch (form) {
			case "login":
				window.location.replace("/dash");
				break;
			case "register":
				this.setState({ form: "success", type: "register" });
				break;
			case "forgot":
				this.setState({ form: "success", type: "forgot" });
				break;
			default:
		}
	}

	apiError(error) {
		const form = this.state.form;
		this.refs[form].submitError(error);
	}

	onFormSubmit(content) {
		const form = this.state.form;

		if (this.api === null) {
			this.refs[form].submitError("no connection to servers");
			return;
		}

		switch (form) {
			case "login":
				this.api.loginUser(content, this.apiSuccess, this.apiError);
				break;
			case "register":
				this.api.registerUser(content, this.apiSuccess, this.apiError);
				break;
			case "forgot":
			default:
		}
	}

	onFormSwitch(toForm) {
		this.setState({
			form: toForm
		});
	}

	renderForm() {
		const form = this.state.form;
		const type = this.state.type;

		switch (form) {
			case "login":
				return (
					<LoginForm
						submit={this.onFormSubmit}
						next={this.onFormSwitch}
						ref={form}
					/>
				);
			case "register":
				return (
					<RegisterForm
						submit={this.onFormSubmit}
						next={this.onFormSwitch}
						ref={form}
					/>
				);
			case "forgot":
				return (
					<ForgotPasswordForm
						submit={this.onFormSubmit}
						next={this.onFormSwitch}
						ref={form}
					/>
				);
			case "success":
				return <SuccessForm type={type} />;
			default:
				return null;
		}
	}

	render() {
		const auth = this.props.auth;

		document.title = "LectureFly | Home";
		return (
			<div className="ContentArea justify-end">
				{!auth ? this.renderForm() : null}
			</div>
		);
	}
}

export default HomeContent;
