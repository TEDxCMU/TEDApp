import React, { Component } from 'react';
import './App.css';
import { auth, provider } from './fire';
import { Schedule } from './components/schedule.js';
import { Navigation } from './components/navigation.js';
import { Login } from './components/login.js';
import { BrowserRouter as Router} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import fire from './fire.js';
import Faq from './components/faq';
import Speakers from './components/speakers';
import StyleGuide from './components/styleguide';
import Footer from './components/footer';
import { isAndroid, isIOS } from "react-device-detect";


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      allData: [],
      iosPopUp: false,
      chromePopUp: false
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
          <Route path="/" exact strict render={this.schedulePage}/>
          <Route path="/faq" exact strict render={this.faqPage}/>
          <Route path="/speakers" exact strict render={this.speakersPage}/>
          <Route path="/styleguide" exact strict render={this.styleGuidePage}/>
          <Route path="/login" exact strict render={this.loginPage}/>
          </div>
        </Router>
        {this.state.chromePopUp === true ? 
          <button align="center">Add this app to ur iOS Homescreen!</button>
          :
          <div align="center"></div>
        }
        <br/>
        {this.state.iosPopUp === true ? 
          <button align="center">Add this app to ur iOS Homescreen!</button>
          :
          <div align="center"></div>
        }
        {/* <ul>{listOfData}</ul> */}
        <Footer />
      </div>
    );
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  schedulePage = (props) => {
    return (
      <Schedule
      user={this.state.user} /> 
    );
  }

  faqPage = (props) => {
    return (
      <Faq
      user={this.state.user} /> 
    );
  }

  styleGuidePage = (props) => {
    return (
      <StyleGuide
      user={this.state.user} /> 
    );
  }

  loginPage = (props) => {
    return (
      <Login
      user={this.state.user}
      login={this.login} /> 
    );
  }

  speakersPage = (props) => {
    return (
      <Speakers
      user={this.state.user} /> 
    );
  }

  componentDidMount() {
    console.log(this.state)
    if (isAndroid) {
      this.setState({
        chromePopUp: isAndroid,
      })
    }
    if (isIOS) {
      this.setState({
        iosPopUp: isIOS,
      })
    }

    console.log(this.state.user)
    const db = fire.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    var wholeData = []
    db.collection('member').orderBy('name', 'asc').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
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

  login = (data) => {
    console.log("hello")
    
    let userInfo = data;
    console.log(userInfo)
      console.log("Logging you in!")
      this.setState({
        user: userInfo
      }, () => console.log(this.state.user))
  }
}

export default App;