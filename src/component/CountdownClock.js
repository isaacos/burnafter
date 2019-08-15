import React, { Component } from 'react';
import { connect } from 'react-redux';


class CountdownClock extends Component {

  //intervalID is reassigned in componentDidUpdate and used in resetCanvas in clearInterval
  intervalID = 0

  componentDidMount(){
    this.renderCircle()
  }

  componentDidUpdate(){
    if(this.props.user){
      this.intervalID = setInterval(() => {this.timer(this.calculateTimeAngle())}, 1000)
    }
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  renderCircle = () => {
    const ctx = this.refs.canvasRef.getContext('2d')
    const x = (this.refs.canvasRef.width / 2)
    const y = (this.refs.canvasRef.height / 2)
    ctx.beginPath()
    ctx.arc(x, y, 90, 4.7, 3.3 * Math.PI)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 20
    ctx.stroke()
    ctx.closePath()
  }

  //draws the red wedge section on canvas based on the time that has passed
  renderWedge = (timeAngle) => {
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
    ctx.closePath()
  }

  //calculates the angle used in the renderWedge function based on the time that has passed
  calculateTimeAngle = () => {
    return -1.55 + 0.0018 * (Math.round(new Date().getTime()/ 1000) - this.props.loginTime)
  }

  //is the control flow function to determine if another red wedge will be drawn on or User will be logedout
  timer = (timeAngle) => {
      if(timeAngle < 4.8){
        return  this.renderWedge(timeAngle)
      } else if(timeAngle >= 4.8){
        this.props.logOutUser()
      }
  }

  resetCanvas = (fetchResponse) => {
    if(fetchResponse.ok === 'postpone successful'){
      this.props.changeLoginTime()
      //clearsInterval to avoid function running timer multiple times
      clearInterval(this.intervalID)
      const canvasRef = this.refs.canvasRef
      const ctx = canvasRef.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
      this.renderCircle()
    } else {
      alert('An issue has occured in delaying the user deletion. Please contact the site administrator')
    }
  }

  postponeUserDeletion = () => {
    fetch(`http://localhost:3090/users/postpone/${this.props.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    .then(response => response.json())
    .then(r => this.resetCanvas(r))
  }

  render(){

    return(
      <div>
        <canvas
          ref="canvasRef"
          width={200}
          height={200}
        />
        <button onClick={() => this.postponeUserDeletion()}>Reset Time Angle</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  //the entire state cannot be passed into the CountDownClock component
  //If other aspects of state are passed in the timer function will run multiple times and be inefficient
  return {user: state.user, loginTime: state.loginTime}
}

const mapDispatchToProps = {
  logOutUser: () => ({type: 'LOGOUTUSER'}),
  changeLoginTime: () => ({type: 'CHANGELOGINTIME'})
}


export default connect(mapStateToProps, mapDispatchToProps)(CountdownClock);
