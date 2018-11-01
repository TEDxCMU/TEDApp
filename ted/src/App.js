import React, { Component } from 'react';
import './App.css';
import { auth, provider } from './fire';
import { Schedule } from './components/schedule.js';
import { Navigation } from './components/navigation.js';
import { BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import fire from './fire.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: []
    }
    //pass THIS to global navigation hamburger menu so people can login and logout everywhere
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

  }
  render() {

    var listOfData = this.state.allData.map((val, i)=>{
      var name = val.name
      var age = val.age
      return (
        <li key={i}>{name} ({age})</li>
      ) 
    })

    return (
      <div>
        <Router>
          <div className="App">
          <Navigation user={this.state.user} login={this.login} logout={this.logout}/>
          {/* <Route path="/" exact strict render={this.homePage}/> */}
          </div>
        </Router>
        <ul>{listOfData}</ul>
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  homePage = (props) => {
    return (
      <Schedule
      user={this.state.user} /> 
    );
  }

  componentDidMount() {
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('member').orderBy('name', 'asc').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        // console.log(doc.id, '=>', doc.data());
        // console.log(doc.data().name + doc.data().age);
        console.log(doc.data());
        wholeData.push(doc.data())
      });
      console.log(wholeData)
      this.setState({allData: wholeData})
      console.log(this.state.allData)
    })
    .catch(error => {
      console.log('Error!', error);
    })
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        const email = user.email.toString();
        if (email.match(/@leftfieldlabs.com/) === null){
          console.log("thou shall not pass");
          this.logout();
        }
        else {
            console.log("thou shall pass");
            this.setState({
              user
            });
        }
      });
  }
}

export default App;