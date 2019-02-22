import React from "react";
import "./css/Login.css";

function Login(props) {
	var content = "Login";

	if (props.loggedIn) {
		content = "Logout";
	}

	return <button>{content}</button>;
}

export default Login;
