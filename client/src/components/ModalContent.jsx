import React, { Component } from "react";
//import axios from "axios";

import FormTextInput from "./FormTextInput";
import ErrorStatus from "./ErrorStatus";

class ModalContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			errors: []
		};

		this.addDeviceInputs = [
			{
				type: "text",
				label: "Device name",
				ref: "deviceName",
				validation: null,
				key: 0
			},
			{
				type: "text",
				label: "ID",
				ref: "deviceId",
				validation: null,
				key: 1
			}
		];
	}

	// getContent() {
	// 	const buttonContent = this.state.recording
	// 		? "Stop Recording"
	// 		: "Start Recording";
	// 	const { type } = this.props.content;

	// 	let renderContent = <div />;

	// 	switch (type) {
	// 		case "device":
	// 			renderContent = (
	// 				<div>
	// 					<button ref="record" onClick={e => this.startStopRecording(e)}>
	// 						{buttonContent}
	// 					</button>
	// 					<br />
	// 					<button onClick={e => this.rotateCamera(e, true)}>Pan Left</button>
	// 					<button onClick={e => this.rotateCamera(e, false)}>
	// 						Pan Right
	// 					</button>
	// 				</div>
	// 			);
	// 			break;
	// 		case "video":
	// 			break;
	// 		default:
	// 	}

	// 	return renderContent;
	// }

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

	renderVideoContent() {
		return "";
	}

	renderDeviceContent() {
		return (
			<div className="ModalContent">
				<img src="" alt="live camera feed" />
			</div>
		);
	}

	renderAddDeviceContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;
		const inputs = this.addDeviceInputs.map(input => (
			<FormTextInput
				type={input.type}
				label={input.label}
				validation={input.validation}
				ref={input.ref}
				key={input.key}
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
				return this.renderAddDeviceContent();
			case "device":
				return this.renderDeviceContent();
			case "video":
				return this.renderVideoContent();
			default:
				return <div className="ModalContent" />;
		}
	}
}

export default ModalContent;
