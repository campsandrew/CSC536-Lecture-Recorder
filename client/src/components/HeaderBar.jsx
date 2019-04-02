import React from "react";
import "./css/HeaderBar.css";

import Logo from "./Logo";

function HeaderBar({ auth, user, onLogout }) {
	let path = "/";

	if (window.location.pathname !== "/dash" && auth) {
		path = "/dash";
	}

	return (
		<header className="HeaderBar">
			<Logo path={path} />
			<span>{auth && user.name ? user.name : ""}</span>
			<nav>{auth ? <button onClick={onLogout}>Logout</button> : null}</nav>
		</header>
	);
}

export default HeaderBar;
