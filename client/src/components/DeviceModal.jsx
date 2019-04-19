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
			errors: []
		};

		this.inputs = [
			{
				type: "text",
				label: "Lecture name",
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
	}

	getContent() {
		let content = {};

		for (let ref in this.refs) {
			if (ref === "tracking") {
				content[ref] = !this.refs[ref].checked;
			} else {
				content[ref] = this.refs[ref].getValue();
			}
		}

		return content;
	}

	isValid() {
		let valid = true;
		let errors = [];

		// Loop through all inputs on form
		for (let ref in this.refs) {
			if (ref === "tracking") continue;
			if (!this.refs[ref].isValid()) {
				errors.push(this.refs[ref].getError());
				valid = false;
			}
		}

		this.setState({ errors: errors });
		return valid;
	}

	onStatusClick(e) {
		this.props.statusClick(this.props.device);
	}

	onSubmit(e) {
		const recording = this.props.recording;
		const device = this.props.device;

		if (!recording && !this.isValid()) return;
		this.setState({ loading: true });
		this.props.onSubmit(this.getContent(), device.id);
	}

	submitError(error) {
		let errors = [error];
		if (this.props.offline) {
			errors = [];
		}

		this.setState({ loading: false, errors: errors });
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
		const offline = this.props.offline;
		const recording = this.props.recording;
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
				disabled={loading || offline || recording}
			/>
		));

		return (
			<div className="content">
				{inputs}
				<div className="tracking">
					<input
						type="checkbox"
						disabled={loading || offline || recording}
						id="tracking"
						ref="tracking"
					/>
					<label htmlFor="tracking">Disable tracking</label>
				</div>
				<ErrorStatus errors={errors} loading={loading} />
			</div>
		);
	}

	renderFooter() {
		const recording = this.props.recording;
		const offline = this.props.offline;
		const loading = this.state.loading;

		let status = "";
		if (recording) {
			status = "Recording";
		} else if (offline) {
			status = "Offline";
		} else {
			status = "Online";
		}

		return (
			<div className="footer">
				<div className="status-code">{status}</div>
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
						disabled={loading || offline}
					>
						{recording ? "Stop" : "Record"}
					</button>
				</div>
			</div>
		);
	}

	render() {
		const device = this.props.device;

		return (
			<div className="Modal">
				<div className="form">
					<TitleBar title={device.name} className="color-dark large">
						<DeviceStatus status={device.status} onClick={this.onStatusClick} />
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
