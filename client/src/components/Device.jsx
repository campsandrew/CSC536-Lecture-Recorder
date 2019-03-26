import React, { Component } from "react";
import axios from "axios";
import "./css/Device.css";

class Device extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: 2
		};

		this.type = "device";
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

		this.updateStatus(statusUrl);
	}

	updateStatus(url) {
		const self = this;
		const config = {
			crossdomain: true
		};

		axios
			.get(url, config)
			.then(function(res) {
				let status = 2;
				if (res.status !== 200 || !res.data.success) {
					return self.setState({
						status: status
					});
				}

				if (res.data.status in self.statusMap) {
					status = res.data.status;
				}

				self.setState({
					status: status
				});
			})
			.catch(function(err) {
				self.setState({
					status: 2
				});
			});
	}

	render() {
		const server = this.props.server;
		const id = this.props.id;
		const click = this.props.onClick;
		const name = this.props.name;
		const statusColor = this.statusMap[this.state.status];
		const status = this.state.status;
		const statusUrl = server + "/" + id + "/status";

		return (
			<li
				className="Device"
				onClick={e => click(e, id, this.type, name, status)}
			>
				{name}
				<div id="status" onClick={(e) => this.updateStatus(statusUrl)} style={{ backgroundColor: statusColor }} />
			</li>
		);
	}
}

export default Device;
