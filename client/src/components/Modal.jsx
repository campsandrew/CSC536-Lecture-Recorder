import React from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";

function Modal(props) {
	const {
		show,
		title,
		primary,
		secondary,
		onPrimary,
		onSecondary,
		action,
		children
	} = props;
	const className = show ? "Modal display-block" : "Modal display-none";

	function renderButtons() {
		let button1 = (
			<button id="primary" onClick={onPrimary}>
				{primary}
			</button>
		);
		let button2 = null;

		if (secondary) {
			button2 = (
				<button id="secondary" onClick={onSecondary}>
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
				{children}
				<hr />
				{renderButtons()}
			</section>
		</div>
	);
}

export default Modal;
