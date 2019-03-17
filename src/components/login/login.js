import React, { Component } from 'react';
import '../../App.css';
import './login.css';
import fire from '../../fire.js';
import { Redirect } from 'react-router-dom';
import posed from 'react-pose';

const Form = posed.form({
  correct: {
    opacity: 1
  },
  incorrect: {
    opacity: 0,
    transition: {
      from: '-5px',
      to: '5px',
      stiffness: 200,
      damping: 20
    }
  }
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
      if (this.state.redirect === true) {
        if (this.state.email === "dijour@cmu.edu") {
          return <Redirect to='/'/>
        }
        // speaker login, redirect them to the myQuestions page
        else {
          return <Redirect to='/questions'/>
        }
      }
      return (
        <div className="login">
            <form onSubmit={this.login}>
                <label>Email:</label>
                <input className={this.state.found ? '' : 'invalid' } type="text" name="email" autoComplete="email" value={this.state.email} onChange={this.handleChange}/>
                <label>Password:</label>
                <input className={this.state.found ? '' : 'invalid' } type="password" name="password" autoComplete="password" value={this.state.password} onChange={this.handleChange}/>
                <br />
                {this.state.found === true ?
                <small> </small>
                :
                <small className="small-red">Could not find an account with that email/password.</small>
                }
                <br />
                <button className="button-primary" type="submit" onClick={this.login}>TED Log In</button>
            </form>            
        </div>
      );
    }


    // default firestore login function with added redirect to home upon successful login
    login = (e) => {
      e.preventDefault();
      fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        this.setState({
          found: true,
          redirect: true
        })
      }).catch((error) => {
          this.setState({
            found: false
          })
        });
    }

    // call login method from App.js
    onClickButton = (event) => {
      event.preventDefault();
      this.props.login(null, this.state.email.toString(), this.state.password.toString())
    }
  
    // default handle change for react forms
    handleChange = (e) => {
        const name = e.target.name
        this.setState({[name]: e.target.value});
      }
  }
  
  export default Login;