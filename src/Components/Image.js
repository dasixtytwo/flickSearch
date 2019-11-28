import React, { Component } from 'react';

class Image extends Component {
	render() {
		return (
			<img className={this.props.className} src={this.props.src} alt={this.props.alt} />
		)
	}
}

export default Image;