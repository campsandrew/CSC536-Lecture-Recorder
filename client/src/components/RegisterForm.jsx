import React, { Component } from "react";
import "./css/Form.css";

import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";

class RegisterForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lecturer: true,
			loading: false,
			errors: []
		};

		this.inputs = [
			{
				type: "text",
				label: "First name",
				ref: "firstName",
				validation: null,
				key: 0
			},
			{
				type: "text",
				label: "Last name",
				ref: "lastName",
				validation: null,
				key: 1
			},
			{
				type: "email",
				label: "Email",
				ref: "email",
				validation: "create-email",
				key: 2
			},
			{
				type: "password",
				label: "Password",
				ref: "password",
				validation: "create-password",
				key: 3
			}
		];
		this.viewer = [
			{
				type: "email",
				label: "Lecturer email",
				ref: "lecturerEmail",
				validation: null,
				key: 4
			}
		];

		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onFocusError = this.onFocusError.bind(this);
		this.onLecturerRadio = this.onLecturerRadio.bind(this);
		this.onViewerRadio = this.onViewerRadio.bind(this);
	}

	getContent() {
		let content = { isLecturer: this.state.lecturer };

		for (let ref in this.refs) {
			content[ref] = this.refs[ref].getValue();
		}

		return content;
	}

	isValid() {
		let valid = true;
		let errors = [];

		// Loop through all inputs on form
		for (let ref in this.refs) {
			if (!this.refs[ref].isValid()) {
				errors.push(this.refs[ref].getError());
				valid = false;
			}
		}

		this.setState({ errors: errors });
		return valid;
	}

	onSubmit(e) {
		if (!this.isValid()) return;
		this.setState({ loading: true });
		this.props.submit(this.getContent());
	}

	submitError(error) {
		this.setState({ loading: false, errors: [error] });
	}

	onKeyPress(e) {
		if (e.key === "Enter") {
			this.onSubmit();
		}
	}

	onFocusError(inputError) {
		let errors = this.state.errors;
		for (let error of errors) {
			if (error === inputError) {
				return;
			}
		}

		errors.push(inputError);
		this.setState({ errors: errors });
	}

	onLecturerRadio(e) {
		let errors = this.state.errors;
		let removeError = err => {
			for (let i in errors) {
				if (errors[i] === err) {
					errors.splice(i, 1);
				}
			}
		};

		// Removes unneed error
		for (let input of this.viewer) {
			if (!this.refs[input.ref].isValid()) {
				removeError(this.refs[input.ref].getError());
			}
		}

		this.setState({ lecturer: true, errors: errors });
	}

	onViewerRadio(e) {
		this.setState({ lecturer: false });
	}

	renderContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;
		const lecturer = this.state.lecturer;
		const fieldInputs = lecturer
			? this.inputs
			: this.inputs.concat(this.viewer);
		const inputs = fieldInputs.map(input => (
			<FormTextInput
				type={input.type}
				label={input.label}
				validation={input.validation}
				ref={input.ref}
				key={input.key}
				onKeyPress={this.onKeyPress}
				onFocusOut={this.onFocusError}
				disabled={loading}
			/>
		));

		return (
			<div>
				<TitleBar title="Create Account" className="color-white text-center" />
				{inputs}
				<div className="user-type">
					<input
						type="radio"
						checked={lecturer}
						onChange={this.onLecturerRadio}
						onKeyPress={this.onKeyPress}
						disabled={loading}
						id="lecturer"
					/>
					<label htmlFor="lecturer">Lecturer</label>
				</div>
				<div className="user-type">
					<input
						type="radio"
						checked={!lecturer}
						onChange={this.onViewerRadio}
						onKeyPress={this.onKeyPress}
						disabled={loading}
						id="viewer"
					/>
					<label htmlFor="viewer">Viewer</label>
				</div>
				<ErrorStatus errors={errors} loading={loading} />
			</div>
		);
	}

	renderNav() {
		const nav = this.props.next;
		const loading = this.state.loading;

		return (
			<nav>
				<button onClick={this.onSubmit} disabled={loading}>
					Register
				</button>
				<div className="form-nav">
					<span className="nav-button" onClick={e => nav("login")}>
						← Login
					</span>
				</div>
			</nav>
		);
	}

	render() {
		const loading = this.state.loading;

		return (
			<div className={"Form" + (loading ? " cursor-wait" : "")}>
				{this.renderContent()}
				<hr />
				{this.renderNav()}
			</div>
		);
	}
}

export default RegisterForm;
