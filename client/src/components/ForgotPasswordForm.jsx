import React, { Component } from "react";
import "./css/Form.css";

import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";

class ForgotPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			errors: []
		};

		this.inputs = [
			{
				type: "email",
				label: "Email",
				ref: "email",
				validation: null,
				key: 0
			}
		];

		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onFocusError = this.onFocusError.bind(this);
	}

	getContent() {
		let content = {};

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

	renderContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;
		const content = this.inputs.map(input => (
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
				<TitleBar title="Forgot Password" className="color-white text-center" />
				{content}
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
					Recover
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

export default ForgotPasswordForm;
