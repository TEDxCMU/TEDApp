import React, { Component } from 'react';
import '../../App.css';
import './login.css';
import fire from '../../fire.js';
import { Redirect } from 'react-router-dom';
import posed from 'react-pose';

const Form = posed.form({
  enter: { y: 0, x: 0, opacity: 1, 
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 15 },
      y: { type: 'spring', stiffness: 300, damping: 15 },
      default: { duration: 300 }
    } 
  },
  exit: { y: 20, opacity: 0, transition: { duration: 150 } }
});

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
      if (this.state.redirect === true){
        return <Redirect to='/'/>
      }
      console.log(this.state.found);
      // if (localStorage.getItem("userEmail") !== "dijour@cmu.edu" && this.state.redirect === true){
      //   return <Redirect to='/questions/'/>
      // }
      return (
        <div className="login">
            <Form pose={this.state.found} onSubmit={this.login}>
                {this.state.found === true ?
                <h1> </h1>
                :
                <h1>Could not find an account with that email/password.</h1>
                }
                <label>Email:</label>
                <input type="text" name="email" autoComplete="email" value={this.state.email} onChange={this.handleChange}/>
                <label>Password:</label>
                <input type="password" name="password" autoComplete="password" value={this.state.password} onChange={this.handleChange}/>
                <br />
                <button className="button-primary" type="submit" onClick={this.login}>TED Log In</button>
            </Form>            
        </div>
      );
    }

    login = (e) => {
      e.preventDefault();
      fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        this.setState({
          found: true,
          redirect: true
        }
        // , () => (console.log(this.state))
        )
      }).catch((error) => {
          this.setState({
            found: false
          })
          // console.log(error);
        });
    }

    onClickButton = (event) => {
      event.preventDefault();
      this.props.login(null, this.state.email.toString(), this.state.password.toString())
    }
  
    handleChange = (e) => {
        const name = e.target.name
        this.setState({[name]: e.target.value});
      }
  
  }
  
  export default Login;