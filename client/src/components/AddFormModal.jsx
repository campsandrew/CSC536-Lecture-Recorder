import React, { Component } from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";

class AddFormModal extends Component {
	constructor(props) {
		super(props);

		this.inputs = [];
		this.title = "";
		this.state = {
			loading: false,
			errors: []
		};

		// Get proper inputs for modal
		switch (props.type) {
			case "device":
				this.title = "Register Device";
				this.inputs = [
					{
						type: "text",
						label: "ID",
						ref: "id",
						validation: null,
						key: 0
					},
					{
						type: "text",
						label: "Device name",
						ref: "name",
						validation: null,
						key: 1
					}
				];
				break;
			case "lecturer":
				this.title = "Add Lecturer";
				this.inputs = [
					{
						type: "email",
						label: "Lecturer email",
						ref: "lecturerEmail",
						validation: null,
						key: 2
					}
				];
				break;
			default:
		}

		this.onFocusError = this.onFocusError.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
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
		this.props.onSubmit(this.getContent());
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
		const inputs = this.inputs.map(input => (
			<FormTextInput
				type={input.type}
				label={input.label}
				validation={input.validation}
				ref={input.ref}
				key={input.key}
				onFocusOut={this.onFocusError}
				onKeyPress={this.onKeyPress}
				disabled={loading}
			/>
		));

		return (
			<div className="content">
				{inputs}
				<ErrorStatus errors={errors} loading={loading} />
			</div>
		);
	}

	renderFooter() {
		const loading = this.state.loading;

		return (
			<div className="footer">
				<div className="buttons">
					<button
						className="secondary"
						onClick={this.props.onClose}
						disabled={loading}
					>
						Close
					</button>
					<button
						className="primary"
						onClick={this.onSubmit}
						disabled={loading}
					>
						Add
					</button>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="Modal">
				<div className="form">
					<TitleBar title={this.title} className="color-dark large" />
					{this.renderContent()}
					<hr />
					{this.renderFooter()}
				</div>
			</div>
		);
	}
}

export default AddFormModal;
