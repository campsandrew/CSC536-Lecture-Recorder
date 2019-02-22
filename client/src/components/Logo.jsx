import React from "react";
import logo from "./images/logo.png";

function Logo(props) {
	function handleClick(e) {
		if (window.location.pathname !== "/") {
			window.location.replace("/");
		}
	}

	return (
		<div onClick={handleClick}>
			<img src={logo} alt="" />
		</div>
	);
}

export default Logo;
