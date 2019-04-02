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

	isValid() {
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
		const onFocusOut = this.props.onFocusOut;

		if (!this.isValid() && onFocusOut) {
			onFocusOut(this.state.error);
		}
	}

	render() {
		const valid = this.state.validInput;
		const label = this.props.label;
		const disabled = this.props.disabled;
		const type = this.props.type;
		const onKeyPress = this.props.onKeyPress;
		const className = valid ? "FormTextInput" : "FormTextInput error";

		// Input or text area options
		let input = (
			<input
				type={type}
				onBlur={this.focusOut}
				onKeyPress={onKeyPress}
				disabled={disabled}
				ref={this.textInput}
			/>
		);
		if (type === "textarea") {
			input = (
				<textarea
					rows="2"
					onBlur={this.focusOut}
					onKeyPress={onKeyPress}
					disabled={disabled}
					ref={this.textInput}
				/>
			);
		}

		return (
			<div className={className}>
				<label htmlFor={this.textInput}>{label}</label>
				{input}
			</div>
		);
	}
}

export default FormTextInput;
