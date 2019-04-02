import React, { Component } from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";
import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";
import DeviceStatus from "./DeviceStatus";

class DeviceModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			errors: [],
			status: props.status
		};

		this.inputs = [
			{
				type: "text",
				label: "Lecturer name",
				ref: "name",
				validation: null,
				key: 0
			},
			{
				type: "textarea",
				label: "Description",
				ref: "description",
				validation: null,
				key: 1
			}
		];

		this.onFocusError = this.onFocusError.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onStatusClick = this.onStatusClick.bind(this);
		this.statusUpdate = this.statusUpdate.bind(this);
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

	statusUpdate(data) {
		this.setState({ status: data.status, loading: false, errors: [] });
	}

	onStatusClick(e) {
		const id = this.props.deviceId;
		const callback = this.props.deviceCallback;
		this.props.onStatusClick(id, [this.statusUpdate, callback]);
		this.setState({ loading: true });
	}

	onSubmit(e) {
		const id = this.props.deviceId;

		if (!this.isValid()) return;
		this.setState({ loading: true });
		this.props.submit(this.getContent(), id);
	}

	submitError(error) {
		this.setState({ status: 2, loading: false, errors: [error] });
		this.props.deviceCallback(error);
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
		const status = this.state.status;
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
				disabled={loading || status === 2 || status === 1}
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
		const status = this.state.status;
		const statusKey = {
			0: "Ready",
			1: "Recording",
			2: "Offline"
		};

		return (
			<div className="footer">
				<div className="status-code">{statusKey[status]}</div>
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
						disabled={loading || status === 2 || status === 1}
					>
						Record
					</button>
				</div>
			</div>
		);
	}

	render() {
		const status = this.state.status;
		const title = this.props.title;

		return (
			<div className="Modal">
				<div className="form">
					<TitleBar title={title} className="color-dark large">
						<DeviceStatus status={status} onClick={this.onStatusClick} />
					</TitleBar>
					{this.renderContent()}
					<hr />
					{this.renderFooter()}
				</div>
			</div>
		);
	}
}

export default DeviceModal;
