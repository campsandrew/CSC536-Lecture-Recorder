import React, { Component } from "react";
import axios from "axios";

class ModalContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			recording: false
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			recording: props.content.recording
		});
	}

	getContent() {
		const buttonContent = this.state.recording
			? "Stop Recording"
			: "Start Recording";
		const { type } = this.props.content;

		let renderContent = <div />;

		switch (type) {
			case "device":
				renderContent = (
					<div>
						<button ref="record" onClick={e => this.startStopRecording(e)}>
							{buttonContent}
						</button>
						<br />
						<button onClick={e => this.rotateCamera(e, true)}>Pan Left</button>
						<button onClick={e => this.rotateCamera(e, false)}>
							Pan Right
						</button>
					</div>
				);
				break;
			case "video":
				break;
			default:
		}

		return renderContent;
	}

	startStopRecording(e) {
		const self = this;
		const server = this.props.server;
		const { id } = this.props.content;
		const recording = this.state.recording;
		const action = recording ? "stop" : "start";
		const url = server + "/" + id + "/record?action=" + action;
		const config = { crossdomain: true };

		this.refs.record.setAttribute("disabled", true);

		axios
			.get(url, config)
			.then(function(res) {
				let cur = !recording;
				if (res.status !== 200 || !res.data.success) {
					console.log(res.data.message);
					cur = false;
				}

				self.setState({
					recording: cur
				});
				self.refs.record.removeAttribute("disabled");
			})
			.catch(function(err) {
				console.log(err);
				self.setState({
					recording: false
				});
				self.refs.record.removeAttribute("disabled");
			});
	}

	rotateCamera(e, left) {
		const server = this.props.server;
		const { id } = this.props.content;
		const direction = left ? "left" : "right";
		const url = server + "/" + id + "/rotate?direction=" + direction;
		const config = { crossdomain: true };

		axios
			.get(url, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					console.log(res.data.message);
					return;
				}
			})
			.catch(err => console.log(err));
	}

	render() {
		const save = this.props.onClick.save;
		const close = this.props.onClick.close;

		return (
			<div className="ModalContent">
				{this.getContent()}
				<hr />
				<div id="buttons">
					<button id="secondary" onClick={close}>
						Close
					</button>
					<button id="primary" onClick={save}>
						Save
					</button>
				</div>
			</div>
		);
	}
}

export default ModalContent;
