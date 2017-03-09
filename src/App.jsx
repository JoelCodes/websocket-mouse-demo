import React, {Component} from 'react';
import Circle from './Circle.jsx'
class App extends Component {
  constructor(props) {
    super(props);
    this.exampleSocket = new WebSocket("ws://localhost:3001");
    this.setState = this.setState.bind(this);
    this.exampleSocket.onopen = () => {
      this.exampleSocket.onmessage = (e) => {
        var data = JSON.parse(e.data);
        switch(data.type){
          case 'Connect':
            this.setState({id: data.id.toString()});
            break;
          case 'Points':
            this.setState({points: data.points.filter(p => p.pointId !== this.state.id)});
            break;
          case "Move":
            this.setState({points: this.state.points.map(p => {
              if(p.pointId === data.pointId) return {x: data.x, y: data.y, pointId: data.pointId};
              return p;
            })});
          default:
        }
        console.log(data);
      }
    }
    this.state = {points: []}
  }
  handleMouseMove(e){
    const {clientX, clientY} = e;
    if(this.exampleSocket.readyState === WebSocket.OPEN){
      this.exampleSocket.send(JSON.stringify({
        x:clientX - e.target.offsetLeft, 
        y:clientY - e.target.offsetTop
      }));
    }
  }
  render() {
    console.log('This.State', this.state);
    const circles = this.state.points.map(point => (
        <Circle top={point.y} left={point.x}/>
      ))
    return (
      <div>
        <h1>Hello React :)</h1>
        <div onMouseMove={this.handleMouseMove.bind(this)} style={{height:'600px', width: '800px', border:'3px solid tomato', borderRadius:'5px', position:'relative'}}>
          {circles}
        </div>
      </div>
    );
  }
}
export default App;
