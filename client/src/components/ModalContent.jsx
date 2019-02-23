import React, { Component } from "react";

class ModalContent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const save = this.props.onClick.save;
		const close = this.props.onClick.close;

		return (
			<div className="ModalContent">
				<div>Content</div>
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
