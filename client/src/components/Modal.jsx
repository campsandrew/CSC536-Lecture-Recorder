import React from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";
import ModalContent from "./ModalContent";

function Modal(props) {
	const {
		show,
		title,
		primary,
		secondary,
		onPrimary,
		onSecondary,
		action,
		content
	} = props;
	const className = show ? "Modal display-block" : "Modal display-none";

	function getAction() {
		const status = {
			0: "Ready",
			1: "Recording",
			2: "Offline"
		};

		if (action && action.status in status) {
			return status[action.status];
		}

		return null;
	}

	function renderButtons() {
		let button1 = (
			<button id="primary" onClick={e => onPrimary(e)}>
				{primary}
			</button>
		);
		let button2 = null;

		if (secondary) {
			button2 = (
				<button id="secondary" onClick={e => onSecondary(e)}>
					{secondary}
				</button>
			);
		}

		return (
			<div id="buttons">
				{button2}
				{button1}
			</div>
		);
	}

	return (
		<div className={className}>
			<section>
				<TitleBar title={title} className="color-dark large" action={action} />
				{show ? <ModalContent content={content} action={action} /> : null}
				<hr />
				<div className="footer">
					<div id="status">{getAction()}</div>
					{renderButtons()}
				</div>
			</section>
		</div>
	);
}

export default Modal;
