

import React from 'react';

class Hello extends React.Component{
	render(){
		return(<div style={{opacity:'0.8',color:'#000000',backgroundColor:'#ffffff'}}>test {this.props.title} {this.props.name}</div>)
		}
	}
export default Hello;