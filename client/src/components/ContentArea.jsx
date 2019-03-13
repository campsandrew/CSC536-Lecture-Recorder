import React, { Component } from "react";
import "./css/ContentArea.css";

import Page from "./Page";
import Modal from "./Modal";
import ModalContent from "./ModalContent";

class ContentArea extends Component {
	constructor(props) {
		super(props);

		this.state = {
			route: "/",
			show: false
		};
	}

	componentDidMount() {
		this.setState({
			route: window.location.pathname
		});
	}

	showModal = (e, title) => {
		this.setState({
			show: true,
			modalTitle: title
		});
	};

	closeModal = e => {
		this.setState({ show: false });
	};

	saveModal = e => {
		this.setState({ show: false });
	};

	render() {
		const server = this.props.server;
		const route = this.state.route;
		const title = this.state.modalTitle;
		const show = this.state.show;
		const onClick = {
			save: this.saveModal,
			close: this.closeModal
		};

		return (
			<div>
				<Page route={route} server={server} onClick={this.showModal} />
				<Modal show={show} title={title}>
					<ModalContent onClick={onClick} />
				</Modal>
			</div>
		);
	}
}

export default ContentArea;
