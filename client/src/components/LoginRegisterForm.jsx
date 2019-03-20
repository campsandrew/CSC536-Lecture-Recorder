import React, { Component } from "react";
import axios from "axios";
import TitleBar from "./TitleBar";

import "./css/LoginRegisterForm.css";

class LoginRegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loginForm: true,
			lecturerChecked: true
		};
	}

	getFormContent(loginForm) {
		const lecturerChecked = this.state.lecturerChecked;
		let lecturerInput = lecturerChecked ? (
			""
		) : (
			<div>
				<label htmlFor="lecturer-email">Lecturer email</label>
				<input
					type="text"
					onBlur={this.focusOut.bind(this)}
					id="lecturerEmail"
					ref="lecturerEmail"
				/>
			</div>
		);
		let content = loginForm ? (
			<div className="content">
				<label htmlFor="email">Email</label>
				<input
					type="text"
					onBlur={this.focusOut.bind(this)}
					id="email"
					ref="email"
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					onBlur={this.focusOut.bind(this)}
					id="password"
					ref="password"
				/>
			</div>
		) : (
			<div className="content">
				<label htmlFor="firstName">First name</label>
				<input
					type="text"
					onBlur={this.focusOut.bind(this)}
					id="firstName"
					ref="firstName"
				/>
				<label htmlFor="lastName">Last name</label>
				<input
					type="texg"
					onBlur={this.focusOut.bind(this)}
					id="lastName"
					ref="lastName"
				/>
				<label htmlFor="email">Email</label>
				<input
					type="text"
					onBlur={this.focusOut.bind(this)}
					id="email"
					ref="email"
				/>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					onBlur={this.focusOut.bind(this)}
					id="password"
					ref="password"
				/>

				<div className="user-type">
					<input
						type="radio"
						name="user"
						value="lecturer"
						onChange={this.onCheck.bind(this)}
						id="lecturer"
						ref="lecturer"
						defaultChecked
					/>
					<label htmlFor="lecturer">Lecturer</label>
				</div>
				<div className="user-type">
					<input
						type="radio"
						name="user"
						value="viewer"
						onChange={this.onCheck.bind(this)}
						id="viewer"
						ref="viewer"
					/>
					<label htmlFor="viewer">Viewer</label>
				</div>
				{lecturerInput}
			</div>
		);

		return content;
	}

	getFormNav(loginForm) {
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
		this.setState({
			loginForm: !this.state.loginForm
		});
	}

	formSubmit(e) {
		const server = this.props.server;
		const loginForm = this.state.loginForm;
		const lecturerChecked = this.state.lecturerChecked;
		const config = { crossdomain: true };
		let url = server + "/user/login";
		let body = {
			email: this.refs.email.value,
			password: this.refs.password.value
		};

		if (!loginForm) {
			url = server + "/user";
			body.firstName = this.refs.firstName.value;
			body.lastName = this.refs.lastName.value;
			body.userType = lecturerChecked
				? this.refs.lecturer.value
				: this.refs.viewer.value;
		}

		if (!lecturerChecked) {
			body.lecturerEmail = this.refs.lecturerEmail.value;
		}

		for (let key in body) {
			if (!body[key]) return;
		}

		axios
			.post(url, body, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return;
				}

				console.log("HERE");
			})
			.catch(err => console.log(err));
	}

	focusOut(e) {
		const value = e.target.value;

		if (!value) {
			e.target.style.border = "2px solid red";
		} else {
			e.target.style.border = "1px solid grey";
		}
	}

	onCheck(e) {
		this.setState({
			lecturerChecked: e.target.value === "lecturer" ? true : false
		});
	}

	render() {
		const loginForm = this.state.loginForm;
		const title = loginForm ? "Login" : "Create Account";

		return (
			<div className="LoginRegisterForm">
				<TitleBar title={title} className="color-white text-center" />
				{this.getFormContent(loginForm)}
				<div className="errors" id="errors" />
				<hr />
				<button onClick={this.formSubmit.bind(this)}>
					{loginForm ? "Sign in" : "Register"}
				</button>
				{this.getFormNav(loginForm)}
			</div>
		);
	}
}

export default LoginRegisterForm;
