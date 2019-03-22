import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import "./css/LoginRegisterForm.css";
import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";

class LoginRegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			redirect: false,
			loginForm: true,
			lecturerChecked: true,
			currentRefs: ["password", "email"],
			loading: false,
			errors: []
		};

		this.loginInputs = [
			{
				type: "email",
				label: "Email",
				ref: "email",
				validation: null,
				key: 0
			},
			{
				type: "password",
				label: "Password",
				ref: "password",
				validation: null,
				key: 1
			}
		];
		this.registerInputs = [
			{
				type: "text",
				label: "First name",
				ref: "firstName",
				validation: null,
				key: 2
			},
			{
				type: "text",
				label: "Last name",
				ref: "lastName",
				validation: null,
				key: 3
			},
			{
				type: "email",
				label: "Email",
				ref: "email",
				validation: "create-email",
				key: 4
			},
			{
				type: "password",
				label: "Password",
				ref: "password",
				validation: "create-password",
				key: 5
			}
		];
		this.viewerInput = [
			{
				type: "email",
				label: "Lecturer email",
				ref: "lecturerEmail",
				validation: null,
				key: 6
			}
		];

		this.formSubmit = this.formSubmit.bind(this);
		this.formSwitch = this.formSwitch.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	getFormContent() {
		const loginForm = this.state.loginForm;
		const lecturerChecked = this.state.lecturerChecked;
		const mapInputs = input => {
			return (
				<FormTextInput
					type={input.type}
					label={input.label}
					validation={input.validation}
					ref={input.ref}
					key={input.key}
					onKeyPress={this.onKeyPress}
				/>
			);
		};
		const viewerInput = !lecturerChecked
			? this.viewerInput.map(mapInputs)
			: null;

		// Get create form content
		let content;
		if (loginForm) {
			content = (
				<div className="content">{this.loginInputs.map(mapInputs)}</div>
			);
		} else {
			content = (
				<div className="content">
					{this.registerInputs.map(mapInputs)}
					<div className="user-type">
						<input
							type="radio"
							name="user"
							ref="lecturer"
							id="lecturer"
							checked={lecturerChecked}
							onChange={this.onRadioChange}
							onKeyPress={this.onKeyPress}
						/>
						<label htmlFor="lecturer">Lecturer</label>
					</div>
					<div className="user-type">
						<input
							type="radio"
							name="user"
							ref="viewer"
							id="viewer"
							checked={!lecturerChecked}
							onChange={this.onRadioChange}
							onKeyPress={this.onKeyPress}
						/>
						<label htmlFor="viewer">Viewer</label>
					</div>
					{viewerInput}
				</div>
			);
		}

		return content;
	}

	getFormNav() {
		const loginForm = this.state.loginForm;
		const label = loginForm ? "Register" : "← Login";
		let links = loginForm ? (
			<nav>
				<span id="register" onClick={this.formSwitch}>
					{label}
				</span>
				<span id="recover">Forgot your password?</span>
			</nav>
		) : (
			<nav>
				<span id="register" onClick={this.formSwitch}>
					{label}
				</span>
			</nav>
		);

		return links;
	}

	formSwitch(e) {
		const login = this.state.loginForm;
		let refs = [];

		if (login) {
			for (let i of this.registerInputs) {
				refs.push(i.ref);
			}
		} else {
			for (let i of this.loginInputs) {
				refs.push(i.ref);
			}
		}

		this.setState({
			loginForm: !login,
			currentRefs: refs,
			errors: []
		});
	}

	formSubmit(e) {
		const config = { crossdomain: true };
		const server = this.props.server;
		const url = this.state.loginForm
			? server + "/user/login"
			: server + "/user";
		const self = this;
		let errors = [];

		if (!this.isFormValid()) {
			return;
		}

		this.setState({
			loading: true,
			errors: []
		});

		axios
			.post(url, this.getFormValues(), config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return self.setState({
						loading: false,
						errors: [res.data.message ? res.data.message : ""]
					});
				}

				sessionStorage.accessToken = res.data.token;
				self.setState({
					redirect: true
				});
			})
			.catch(function(err) {
				return self.setState({
					loading: false,
					errors: ["connection error"]
				});
			});
	}

	isFormValid() {
		const refs = this.state.currentRefs;
		let valid = true;
		let errors = [];

		for (let ref of refs) {
			if (!this.refs[ref].validateInput()) {
				errors.push(this.refs[ref].getError());
				valid = false;
			}
		}

		this.setState({
			errors: errors
		});

		return valid;
	}

	getFormValues() {
		const refs = this.state.currentRefs;
		const login = this.state.loginForm;
		let values = {};

		for (let ref of refs) {
			values[ref] = this.refs[ref].getValue();
		}

		if (!login) {
			values.isLecturer = this.state.lecturerChecked;
		}

		return values;
	}

	onRadioChange(e) {
		const lecturer = e.target.id === "lecturer" && e.target.checked;
		let refs = this.state.currentRefs;

		if (!lecturer) {
			for (let i of this.viewerInput) {
				refs.push(i.ref);
			}
		} else {
			refs = refs.slice(0, -1);
		}

		this.setState({
			lecturerChecked: lecturer,
			currentRefs: refs
		});
	}

	onKeyPress(e) {
		if (e.key === "Enter") this.formSubmit(e);
	}

	render() {
		const redirect = this.state.redirect;
		const loginForm = this.state.loginForm;
		const errors = this.state.errors;
		const loading = this.state.loading;
		const title = loginForm ? "Login" : "Create Account";
		const className = "LoginRegisterForm" + (loading ? " cursor-wait" : "");

		if (redirect) {
			return <Redirect to="/dash" />;
		}

		return (
			<div className={className}>
				<TitleBar title={title} className="color-white text-center" />
				{this.getFormContent()}
				<ErrorStatus errors={errors} loading={loading} />
				<hr />
				<button onClick={this.formSubmit}>
					{loginForm ? "Sign in" : "Register"}
				</button>
				{this.getFormNav()}
			</div>
		);
	}
}

export default LoginRegisterForm;
