import React, { Component } from "react";
import axios from "axios";

import "./css/LoginRegisterForm.css";
import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";

class LoginRegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loginForm: true,
			lecturerChecked: true,
			currentRefs: ["password", "email"]
		};

		this.loginInputs = [
			{
				type: "text",
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
				type: "text",
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
				type: "text",
				label: "Lecturer email",
				ref: "lecturer-email",
				validation: null,
				key: 6
			}
		];

		this.formSubmit = this.formSubmit.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
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
							checked={lecturerChecked}
							onChange={this.onRadioChange}
						/>
						<label htmlFor="lecturer">Lecturer</label>
					</div>
					<div className="user-type">
						<input
							type="radio"
							name="user"
							ref="viewer"
							checked={!lecturerChecked}
							onChange={this.onRadioChange}
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
				<span id="register" onClick={e => this.switchForm(e)}>
					{label}
				</span>
				<span id="recover">Forgot your password?</span>
			</nav>
		) : (
			<nav>
				<span id="register" onClick={e => this.switchForm(e)}>
					{label}
				</span>
			</nav>
		);

		return links;
	}

	switchForm(e) {
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
			currentRefs: refs
		});
	}

	formSubmit(e) {
		const config = { crossdomain: true };
		const server = this.props.server;
		const url = this.state.loginForm
			? server + "/user/login"
			: server + "/user";

		if (!this.isFormValid()) {
			return;
		}

		axios
			.post(url, this.getFormValues(), config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return;
				}
			})
			.catch(err => console.log(err));
	}

	isFormValid() {
		const refs = this.state.currentRefs;
		let valid = true;

		for (let ref of refs) {
			if (!this.refs[ref].validateInput()) {
				valid = false;
			}
		}

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
			values["isLecturer"] = this.state.lecturerChecked;
		}

		return values;
	}

	onRadioChange(e) {
		const lecturer = this.state.lecturerChecked;
		let refs = this.state.currentRefs;

		if (lecturer) {
			for (let i of this.viewerInput) {
				refs.push(i.ref);
			}
		}

		this.setState({
			lecturerChecked: !lecturer,
			currentRefs: refs
		});
	}

	render() {
		const loginForm = this.state.loginForm;
		const title = loginForm ? "Login" : "Create Account";

		return (
			<div className="LoginRegisterForm">
				<TitleBar title={title} className="color-white text-center" />
				{this.getFormContent()}
				<div className="errors" id="errors" />
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
