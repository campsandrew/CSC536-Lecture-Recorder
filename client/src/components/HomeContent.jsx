import React from "react";
import LoginRegisterForm from "./LoginRegisterForm";

import "./css/ContentArea.css";

function HomeContent({ server, auth }) {
	document.title = "LectureFly | Home";

	return (
		<div className="ContentArea justify-end">
			{!auth ? <LoginRegisterForm server={server} /> : null}
		</div>
	);
}

export default HomeContent;
