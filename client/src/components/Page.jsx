import React from "react";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

function Page(props) {
	const route = props.route;
	const onClick = props.onClick;

	var content = "";

	switch (route) {
		case "/":
			document.title = "LectureFly | Home";
			content = <div className="ContentArea" />;
			break;
		case "/dash":
			document.title = "LectureFly | Dash";
			content = (
				<div className="ContentArea">
					<DeviceList onClick={onClick} />
					<VideoList onClick={onClick} />
				</div>
			);
			break;
		default:
			//TODO: Show 404 error
			document.title = "LectureFly | Error";
			content = "";
	}

	return content;
}

export default Page;
