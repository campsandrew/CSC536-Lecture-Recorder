import React from "react";
import "./css/Login.css";

function Login(props) {
	var content = "Login";

	if (props.loggedIn) {
		content = "Logout";
	}

	return <button className="Login">{content}</button>;
}

export default Login;
