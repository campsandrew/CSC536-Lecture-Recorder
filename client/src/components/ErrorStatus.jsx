import React from "react";

function ErrorStatus({ errors, loading }) {
	if (loading) {
		return <div className="loading">loading . . .</div>;
	}

	return (
		<div className="errors">
			{errors.map((msg, index) => {
				return <li key={index}>{msg}</li>;
			})}
		</div>
	);
}

export default ErrorStatus;
