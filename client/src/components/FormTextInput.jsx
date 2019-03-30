import React, { Component } from "react";

import "./css/FormTextInput.css";

class FormTextInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			validInput: true,
			error: this.props.label + " required"
		};

		this.textInput = React.createRef();
		this.focusOut = this.focusOut.bind(this);
	}

	getValue() {
		return this.textInput.current.value;
	}

	getError() {
		return this.state.error;
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

		if (this.props.onFocusOut) {
			this.props.onFocusOut(e, this);
		}
	}

	render() {
		const valid = this.state.validInput;
		const label = this.props.label;
		const disabled = this.props.disabled;
		const type = this.props.type;
		const onKeyPress = this.props.onKeyPress;
		const className = valid ? "FormTextInput" : "FormTextInput error";

		return (
			<div className={className}>
				<label htmlFor={this.textInput}>{label}</label>
				<input
					type={type}
					onBlur={this.focusOut}
					ref={this.textInput}
					onKeyPress={onKeyPress}
					disabled={disabled}
				/>
			</div>
		);
	}
}

export default FormTextInput;
