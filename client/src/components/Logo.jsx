import React from "react";
import logo from "./images/logo.png";

function Logo({ path }) {
	function handleClick(e) {
		if (window.location.pathname !== path) {
			window.location.replace(path);
		}
	}

	return (
		<div onClick={handleClick}>
			<img src={logo} alt="" />
		</div>
	);
}

export default Logo;
