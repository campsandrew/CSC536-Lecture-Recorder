import React, { Component } from "react";
import API from "../api";

import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";
import testing from "./images/teaching.jpg";

class ModalContent extends Component {
	constructor(props) {
		super(props);

		// Get content inputs
		this.inputs = [];
		switch (props.content) {
			case "add-device":
				this.inputs = [
					{
						type: "text",
						label: "ID",
						ref: "deviceId",
						validation: null,
						key: 0
					},
					{
						type: "text",
						label: "Device name",
						ref: "deviceName",
						validation: null,
						key: 1
					}
				];
				break;
			case "add-lecturer":
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
			case "device":
				this.inputs = [
					{
						type: "text",
						label: "Lecture title",
						ref: "name",
						validation: null,
						key: 3
					}
				];
				break;
			case "video":
			default:
				this.inputs = [];
		}

		// Add refs that are in modal content
		let currentRefs = [];
		for (let input of this.inputs) {
			currentRefs.push(input.ref);
		}

		this.state = {
			loading: false,
			currentRefs: currentRefs,
			errors: []
		};

		this.onInputFocusOut = this.onInputFocusOut.bind(this);
		this.api = null;
	}

	// startStopRecording(e) {
	// 	const self = this;
	// 	const server = this.props.server;
	// 	const { id } = this.props.content;
	// 	const recording = this.state.recording;
	// 	const action = recording ? "stop" : "start";
	// 	const url = server + "/" + id + "/record?action=" + action;
	// 	const config = { crossdomain: true };

	// 	this.refs.record.setAttribute("disabled", true);

	// 	axios
	// 		.get(url, config)
	// 		.then(function(res) {
	// 			let cur = !recording;
	// 			if (res.status !== 200 || !res.data.success) {
	// 				console.log(res.data.message);
	// 				cur = false;
	// 			}

	// 			self.setState({
	// 				recording: cur
	// 			});
	// 			self.refs.record.removeAttribute("disabled");
	// 		})
	// 		.catch(function(err) {
	// 			console.log(err);
	// 			self.setState({
	// 				recording: false
	// 			});
	// 			self.refs.record.removeAttribute("disabled");
	// 		});
	// }

	// rotateCamera(e, left) {
	// 	const server = this.props.server;
	// 	const { id } = this.props.content;
	// 	const direction = left ? "left" : "right";
	// 	const url = server + "/" + id + "/rotate?direction=" + direction;
	// 	const config = { crossdomain: true };

	// 	axios
	// 		.get(url, config)
	// 		.then(function(res) {
	// 			if (res.status !== 200 || !res.data.success) {
	// 				console.log(res.data.message);
	// 				return;
	// 			}
	// 		})
	// 		.catch(err => console.log(err));
	// }

	isValidForm() {
		const refs = this.state.currentRefs;
		let valid = true;
		let errors = [];

		for (let ref of refs) {
			if (!this.refs[ref].validateInput()) {
				errors.push(this.refs[ref].getError());
				valid = false;
			}
		}

		this.setState({
			errors: errors
		});

		return valid;
	}

	onInputFocusOut(e, input) {
		let errors = this.state.errors;

		if (!input.validateInput()) {
			let err = input.getError();

			for (let i in errors) {
				if (errors[i] === err) {
					return;
				}
			}

			errors.push(err);
			this.setState({
				errors: errors
			});
		}
	}

	renderVideoContent() {
		return null;
	}

	renderDeviceContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;
		const action = this.props.action;
		const inputs = this.inputs.map(input => (
			<FormTextInput
				type={input.type}
				label={input.label}
				validation={input.validation}
				ref={input.ref}
				key={input.key}
				onFocusOut={this.onInputFocusOut}
			/>
		));

		let content;
		if (action && (action.status === 0 || action.status === 1)) {
			content = (
				<div className="ModalContent">
					{inputs}
					<div className="FormTextInput">
						<label htmlFor="description">Description</label>
						<textarea rows="2" ref="description" />
					</div>
					<img src={testing} alt="live camera feed" />
					<ErrorStatus errors={errors} loading={loading} />
				</div>
			);
		} else {
			content = (
				<div className="ModalContent">
					{inputs}
					<div className="FormTextInput">
						<label htmlFor="description">Description</label>
						<textarea rows="2" ref="description" />
					</div>
					<ErrorStatus errors={errors} loading={loading} />
				</div>
			);
		}

		return content;
	}

	renderAddContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;

		const inputs = this.inputs.map(input => (
			<FormTextInput
				type={input.type}
				label={input.label}
				validation={input.validation}
				ref={input.ref}
				key={input.key}
				onFocusOut={this.onInputFocusOut}
			/>
		));

		return (
			<div className="ModalContent">
				{inputs}
				<ErrorStatus errors={errors} loading={loading} />
			</div>
		);
	}

	render() {
		const contentType = this.props.content;

		switch (contentType) {
			case "add-device":
				return this.renderAddContent();
			case "device":
				return this.renderDeviceContent();
			case "add-lecturer":
				return this.renderAddContent();
			case "video":
				return this.renderVideoContent();
			default:
				return <div className="ModalContent" />;
		}
	}
}

export default ModalContent;
