import React, { Component } from 'react';
import '../App.css';
import './schedule.css';
import fire from '../fire.js';

export class Login extends Component {
    constructor() {
      super();
      this.state = {
        name: "",
        password: "",
        found: true
      }
  
  
    }
    render() {
  
      return (
        <div className="schedule">
            <form>
                {this.state.found === true ?
                <h1>  </h1>
            
                :
                <h1> Could not find an account with that email/password.</h1>
                }
                <label>
                    Email:
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                    Password:
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                </label>
                <button type="button" onClick={this.checkLogin}>Log In</button>
            </form>            
        </div>
      );
    }
  
    handleChange = (e) => {
        const name = e.target.name
        this.setState({[name]: e.target.value});
      }
  
    checkLogin = () => {
        const db = fire.firestore();
        db.settings({
          timestampsInSnapshots: true
        });
        var credential = (db.collection('speakers').where('password', '==', 'bsags'));
        var speakersRef = db.collection('speakers');
        var query = speakersRef.where('email', '==', this.state.email).where('password', '==', this.state.password).get()
          .then(snapshot => {
              if (snapshot.size === 0){
                return this.setState({found: false})
              } 
            snapshot.forEach(doc => {
                console.log(doc.data())
              this.props.login(doc.data());
            });
          })
          .catch(err => {
            console.log('Error getting documents', err);
          });
    }

    componentDidMount() {
        console.log("now on the login page");
        console.log(this.props.user)
    }
  }
  
  export default Login;