import React from "react";
import { Redirect } from "react-router-dom";

function ErrorContent({ path }) {
	if (path !== "/unauthorized" && path !== "/error") {
		return <Redirect to="/error" />;
	}

	document.title = "LectureFly | Error";
	return <div />;
}

export default ErrorContent;
