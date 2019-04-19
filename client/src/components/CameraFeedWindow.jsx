import React from "react";
import "./css/CameraFeedWindow.css";

import TitleBar from "./TitleBar";
import CameraFeed from "./CameraFeed";

function CameraFeedWindow({ device, feedError, fps, shutdown }) {
	return (
		<div className="CameraFeedWindow">
			<TitleBar title={device.name} />
			<CameraFeed device={device} fps={fps} feedError={feedError} />
			<hr />
			<div className="footer">
				<button onClick={() => shutdown(device)}>Turn off</button>
			</div>
		</div>
	);
}

export default CameraFeedWindow;
