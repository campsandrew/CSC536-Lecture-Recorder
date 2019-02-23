import React, { Component } from "react";
import "./css/App.css";

import HeaderBar from "./HeaderBar";
import ContentArea from "./ContentArea";

class App extends Component {
	render() {
		return (
			<div>
				<HeaderBar loggedIn={true} />
				<ContentArea />
			</div>
		);
	}
}

export default App;
