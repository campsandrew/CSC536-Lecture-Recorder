import React, { Component } from "react";
import "./css/LoginRegisterForm.css";

import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";
import API from "../api";

class LoginRegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
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

		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormSwitch = this.onFormSwitch.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onInputFocusOut = this.onInputFocusOut.bind(this);
		this.apiError = this.apiError.bind(this);
		this.apiRegisterSuccess = this.apiRegisterSuccess.bind(this);
		this.apiLoginSuccess = this.apiLoginSuccess.bind(this);
		this.api = null;
	}

	componentDidUpdate(prevProps) {
		if (this.api === null && this.props.server) {
			this.api = new API(this.props.server);
		}
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

	onFormSwitch(e) {
		const login = this.state.loginForm;
		if (this.state.loading) return;

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

	onFormSubmit(e) {
		if (!this.isFormValid()) return;

		this.setState({
			loading: true,
			errors: []
		});

		if (this.state.loginForm) {
			this.api.loginUser(
				this.getFormValues(),
				this.apiLoginSuccess,
				this.apiError
			);
		} else {
			this.api.registerUser(
				this.getFormValues(),
				this.apiRegisterSuccess,
				this.apiError
			);
		}
	}

	apiLoginSuccess(user) {
		this.setState({
			loading: false
		});
		window.location.replace("/dash");
	}

	apiRegisterSuccess(user) {
		this.setState({
			loading: false
		});
	}

	apiError(err) {
		this.setState({
			loading: false,
			errors: [err]
		});
	}

	onRadioChange(e) {
		const lecturer = e.target.id === "lecturer" && e.target.checked;
		let errors = this.state.errors;
		let refs = this.state.currentRefs;

		if (!lecturer) {
			for (let i of this.viewerInput) {
				refs.push(i.ref);
			}
		} else {
			let err = this.refs[refs.slice(-1)].getError();
			for (let i in errors) {
				if (errors[i] === err) {
					errors.splice(i, 1);
				}
			}
			refs = refs.slice(0, -1);
		}

		this.setState({
			lecturerChecked: lecturer,
			currentRefs: refs
		});
	}

	onKeyPress(e) {
		if (e.key === "Enter") this.onFormSubmit(e);
	}

	onInputFocusOut(e, input) {
		let errors = this.state.errors;

		if (!input.validateInput()) {
			let err = input.getError();

			for (let i in errors) {
				if (errors[i] === err) {
					return;
				}
			}

			errors.push(err);
			this.setState({
				errors: errors
			});
		}
	}

	renderFormNav() {
		const loginForm = this.state.loginForm;
		const label = loginForm ? "Register" : "← Login";
		let links = loginForm ? (
			<nav>
				<span id="register" onClick={this.onFormSwitch}>
					{label}
				</span>
				<span id="recover">Forgot your password?</span>
			</nav>
		) : (
			<nav>
				<span id="register" onClick={this.onFormSwitch}>
					{label}
				</span>
			</nav>
		);

		return links;
	}

	renderFormContent() {
		const loading = this.state.loading;
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
					onFocusOut={this.onInputFocusOut}
					disabled={loading}
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
							disabled={loading}
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
							disabled={loading}
						/>
						<label htmlFor="viewer">Viewer</label>
					</div>
					{viewerInput}
				</div>
			);
		}

		return content;
	}

	render() {
		const loginForm = this.state.loginForm;
		const errors = this.state.errors;
		const loading = this.state.loading;
		const title = loginForm ? "Login" : "Create Account";
		const className = "LoginRegisterForm" + (loading ? " cursor-wait" : "");

		return (
			<div className={className}>
				<TitleBar title={title} className="color-white text-center" />
				{this.renderFormContent()}
				<ErrorStatus errors={errors} loading={loading} />
				<hr />
				<button onClick={this.onFormSubmit} disabled={loading}>
					{loginForm ? "Sign in" : "Register"}
				</button>
				{this.renderFormNav()}
			</div>
		);
	}
}

export default LoginRegisterForm;
