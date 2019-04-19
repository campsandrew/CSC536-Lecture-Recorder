import React, { Component } from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";
import ErrorStatus from "./ErrorStatus";

class RemoveFormModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			errors: []
		};

		if (props.hasOwnProperty("device")) {
			this.title = "Delete Device";
			this.item = props.device;
		} else if (props.hasOwnProperty("video")) {
			this.title = "Delete Lecture";
			this.item = props.video;
		} else {
			this.title = "";
			this.item = {};
		}

		this.onSubmit = this.onSubmit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onSubmit(e) {
		this.setState({ loading: true });
		this.props.onSubmit(null, this.item.id);
	}

	submitError(error) {
		this.setState({ loading: false, errors: [error] });
	}

	onKeyPress(e) {
		if (e.key === "Enter") {
			this.onSubmit();
		}
	}

	renderContent() {
		const errors = this.state.errors;
		const loading = this.state.loading;

		return (
			<div className="content">
				<div className="note">
					Are you sure you would like to delete {this.item.name}?
				</div>
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
						Remove
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

export default RemoveFormModal;
