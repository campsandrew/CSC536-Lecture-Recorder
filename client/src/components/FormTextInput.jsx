import React, { Component } from "react";

import "./css/FormTextInput.css";

class FormTextInput extends Component {
	constructor(props, ref) {
		super(props);

		this.state = {
			validInput: true
		};

		this.textInput = React.createRef();
		this.focusOut = this.focusOut.bind(this);
	}

	getValue() {
		return this.textInput.current.value;
	}

	validateInput() {
		const validation = this.props.validation;
		let valid = true;

		switch (validation) {
			case "create-password":
			case "create-email":
			default:
				valid = this.hasInput() && valid;
		}

		this.setState({
			validInput: valid
		});

		return valid;
	}

	hasInput() {
		const value = this.textInput.current.value;
		return !value ? false : true;
	}

	focusOut(e) {
		this.validateInput();
	}

	render() {
		const valid = this.state.validInput;
		const label = this.props.label;
		const type = this.props.type;
		const className = valid ? "FormTextInput" : "FormTextInput error";

		return (
			<div className={className}>
				<label htmlFor={this.textInput}>{label}</label>
				<input type={type} onBlur={this.focusOut} ref={this.textInput} />
			</div>
		);
	}
}

export default FormTextInput;
