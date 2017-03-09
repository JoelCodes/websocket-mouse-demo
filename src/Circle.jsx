import React, {Component} from 'react';

export default class Circle extends Component {
	render(){
		const top = (this.props.top || 0) + "px";
		const left = (this.props.left || 0) + "px";
		const size = "50px";
	    const circleStyle = {height: size, width: size, background: 'tomato', borderRadius: '100%', position:'absolute', top, left};
		return <div style={circleStyle}>&nbsp;</div>;
	}
}