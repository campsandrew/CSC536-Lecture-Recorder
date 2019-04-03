import React from "react";
import "./css/CameraFeedWindow.css";

import TitleBar from "./TitleBar";
import CameraFeed from "./CameraFeed";

function CameraFeedWindow({ device, url, feedError }) {
	return (
		<div className="CameraFeedWindow">
			<TitleBar title={device.name} />
			<CameraFeed device={device} fps={20} feed={url} feedError={feedError} />
		</div>
	);
}

export default CameraFeedWindow;
