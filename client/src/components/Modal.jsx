import React from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";

function Modal({ show, title, primary, action, onClose, onPrimary, children }) {
	const className = show ? "Modal display-block" : "Modal display-none";

	function renderPrimary() {
		if (primary) {
			return (
				<button id="primary" onClick={onPrimary}>
					{primary}
				</button>
			);
		}
		return null;
	}

	return (
		<div className={className}>
			<section>
				<TitleBar title={title} className="color-dark large" action={action} />
				{children}
				<hr />
				<div id="buttons">
					<button id="secondary" onClick={onClose}>
						Close
					</button>
					{renderPrimary()}
				</div>
			</section>
		</div>
	);
}

export default Modal;
