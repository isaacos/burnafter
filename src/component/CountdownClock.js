import React, { Component } from 'react';
import { connect } from 'react-redux';


class CountdownClock extends Component {

  componentDidMount(){
    const ctx = this.refs.canvasRef.getContext('2d')
    const x = (this.refs.canvasRef.width / 2)
    const y = (this.refs.canvasRef.height / 2)
    ctx.beginPath()
    ctx.arc(x, y, 90, 4.7, 3.3 * Math.PI)
    ctx.lineWidth = 20
    ctx.stroke()
  }

  componentDidUpdate(){
    if(this.props.user){
      this.timer()
    }
  }

  timer = () => {
    let timeAngle = -1.55 //timeAngle is not in state because it will cause increase exponentially
    setInterval(() => {
      if(timeAngle < 4.8){
        const ctx = this.refs.canvasRef.getContext('2d')
        const x = (this.refs.canvasRef.width / 2)
        const y = (this.refs.canvasRef.height / 2)
        ctx.beginPath()
        ctx.moveTo(x,y)
        ctx.arc(x, y, 90, 4.7, timeAngle)
        ctx.lineTo(x,y)
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 5
        ctx.stroke()
        timeAngle += 0.0018
      } else if(timeAngle >= 4.8){
        this.props.logOutUser()
      }
    }, 1000)
  }

  render(){
    return(
      <div>
        <canvas
          ref="canvasRef"
          width={200}
          height={200}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

const mapDispatchToProps = {
  logOutUser: () => ({type: 'LOGOUTUSER'})
}


export default connect(mapStateToProps, mapDispatchToProps)(CountdownClock);
