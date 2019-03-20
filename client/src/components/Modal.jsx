import React from "react";
import "./css/Modal.css";

import TitleBar from "./TitleBar";

function Modal({ show, title, children }) {
	const className = show ? "Modal display-block" : "Modal display-none";

	return (
		<div className={className}>
			<section>
				<TitleBar title={title} className="color-dark large" />
				{children}
			</section>
		</div>
	);
}

export default Modal;
