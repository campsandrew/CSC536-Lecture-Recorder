import React, { Component } from "react";
import axios from "axios";
import "./css/Device.css";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 2
		};

		this.statusMap = {
			0: "green",
			1: "yellow",
			2: "red"
		};
	}

	componentDidMount() {
		const id = this.props.id;
		const server = this.props.server;
		const statusUrl = server + "/" + id + "/status";

		//this.timer = setInterval(() => console.log("HERE"), 1000);

		this.timer = setInterval(() => this.updateStatus(statusUrl), 5000);
		this.updateStatus(statusUrl);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	updateStatus(url) {
		const self = this;
		const config = {
			crossdomain: true
		};

		axios
			.get(url, config)
			.then(function(res) {
				if (res.status !== 200 || !res.data.success) {
					return self.setState({
						status: 2
					});
				}

				let status = 2;
				if (res.data.status in self.statusMap) {
					status = res.data.status;
				}

				self.setState({
					status: status
				});
			})
			.catch(err => console.log(err));
	}

	render() {
		const click = this.props.onClick;
		const name = this.props.name;
		const statusColor = this.statusMap[this.state.status];
		const status = <div id="status" style={{ backgroundColor: statusColor }} />;

		return (
			<li className="Device" onClick={e => click(e, name)}>
				{name}
				{status}
			</li>
		);
	}
}

export default Device;
