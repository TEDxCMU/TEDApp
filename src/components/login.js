import React, { Component } from 'react';
import '../App.css';
import './login.css';
import fire from '../fire.js';
import { Redirect } from 'react-router-dom'

export class Login extends Component {
    constructor() {
      super();
      this.state = {
        email: "",
        password: "",
        found: true,
        redirect: false
      }
  
  
    }
    render() {
      console.log(localStorage.getItem("userEmail"))
      if (this.state.redirect === true){
        return <Redirect to='/'/>
      }
      // if (localStorage.getItem("userEmail") !== "dijour@cmu.edu" && this.state.redirect === true){
      //   return <Redirect to='/questions/'/>
      // }
      return (
        <div className="login">
            <form onSubmit={this.login}>
                {this.state.found === true ?
                <h1>  </h1>
            
                :
                <h1> Could not find an account with that email/password.</h1>
                }
                <label>Email:</label>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                <label>Password:</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                <br />
                <button type="submit" onClick={this.login}>TED Log In</button>
            </form>            
        </div>
      );
    }

    login = (e) => {
      e.preventDefault();
      fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        console.log(u.user.email)
        this.setState({
          redirect: true
        }, () => (console.log(this.state)))
      }).catch((error) => {
          console.log(error);
        });
    }

    onClickButton = (event) => {
      console.log(this.state.email)
      event.preventDefault();
      this.props.login(null, this.state.email.toString(), this.state.password.toString())
    }
  
    handleChange = (e) => {
        const name = e.target.name
        this.setState({[name]: e.target.value});
      }
  
  }
  
  export default Login;