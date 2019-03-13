import React from "react";

import DeviceList from "./DeviceList";
import VideoList from "./VideoList";

function Page(props) {
	let server = props.server;
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
					<DeviceList server={server} onClick={onClick} />
					<VideoList server={server} onClick={onClick} />
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
