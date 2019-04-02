import React from "react";
import "./css/Form.css";

import TitleBar from "./TitleBar";

function SuccessForm({ type }) {
	function renderContent() {
		let title = "Success";
		let content = "Thank you for registering with LectureFly!";
		if (type === "forgot") {
			title = "Reset Password";
			content = "Check your email for a password recovery link";
		}

		return (
			<div>
				<TitleBar
					title={title}
					className="color-white space-around no-side-padding"
				/>
				<p>{content}</p>
			</div>
		);
	}

	function renderNav() {
		if (type === "register") {
			return (
				<div>
					<hr />
					<button onClick={e => window.location.replace("/dash")}>
						Dashboard
					</button>
				</div>
			);
		}

		return null;
	}

	return (
		<div className="Form">
			{renderContent()}
			{renderNav()}
		</div>
	);
}

export default SuccessForm;
